import { supabase } from "./supabase";
import {
  getSeedQuestion,
  isSeedQuestionId,
  listSeedQuestions,
} from "./seedQuestions";
import type {
  Question,
  QuestionWithFiles,
  RunTestsResponse,
  Submission,
  SubmissionRun,
  TestResult,
} from "./types/questions";

export async function fetchQuestions(): Promise<Question[]> {
  const { data, error } = await supabase
    .from("questions")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: true });

  if (error || !data?.length) {
    return listSeedQuestions();
  }
  return data as Question[];
}

export async function fetchQuestionBySlug(
  slug: string,
): Promise<QuestionWithFiles | null> {
  const { data: question, error: qErr } = await supabase
    .from("questions")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();

  if (qErr || !question) {
    return getSeedQuestion(slug);
  }

  const { data: files, error: fErr } = await supabase
    .from("question_files")
    .select("*")
    .eq("question_id", question.id)
    .in("kind", ["starter", "readonly"]);

  if (fErr || !files?.length) {
    const seed = getSeedQuestion(slug);
    if (seed && seed.slug === slug) return seed;
    return null;
  }

  return {
    ...(question as Question),
    files: files as QuestionWithFiles["files"],
  };
}

export function filesToWorkspace(
  files: QuestionWithFiles["files"],
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const f of files) {
    out[f.path] = f.content;
  }
  return out;
}

export function readonlyPaths(
  files: QuestionWithFiles["files"],
): Set<string> {
  return new Set(
    files.filter((f) => f.kind === "readonly").map((f) => f.path),
  );
}

export async function runTests(
  questionSlug: string,
  files: Record<string, string>,
  readonlyPaths: Set<string>,
): Promise<RunTestsResponse> {
  const payload: Record<string, string> = {};
  for (const [path, content] of Object.entries(files)) {
    if (!readonlyPaths.has(path)) {
      payload[path] = content;
    }
  }
  const res = await fetch("/api/run", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ questionSlug, files: payload }),
  });

  if (!res.ok) {
    const text = await res.text();
    try {
      const json = JSON.parse(text) as { error?: string };
      if (json.error) throw new Error(json.error);
    } catch (e) {
      if (e instanceof Error && e.message !== text) throw e;
    }
    throw new Error(text || `Runner failed (${res.status})`);
  }
  return res.json() as Promise<RunTestsResponse>;
}

export async function saveSubmissionRun(
  userId: string,
  questionId: string,
  result: RunTestsResponse,
  submissionId?: string,
): Promise<SubmissionRun | null> {
  const { data, error } = await supabase
    .from("submission_runs")
    .insert({
      user_id: userId,
      question_id: questionId,
      submission_id: submissionId ?? null,
      passed: result.passed,
      total: result.total,
      results: result.results,
      stdout: result.stdout ?? null,
      duration_ms: result.durationMs ?? null,
    })
    .select()
    .single();

  if (error) {
    console.warn("[submission_runs]", error.message);
    return null;
  }
  return data as SubmissionRun;
}

export async function upsertSubmission(
  userId: string,
  questionId: string,
  files: Record<string, string>,
  status: "in_progress" | "passed",
): Promise<Submission | null> {
  const { data, error } = await supabase
    .from("submissions")
    .upsert(
      {
        user_id: userId,
        question_id: questionId,
        files,
        status,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,question_id" },
    )
    .select()
    .single();

  if (error) {
    console.warn("[submissions]", error.message);
    return null;
  }
  return data as Submission;
}

export async function fetchSubmission(
  userId: string,
  questionId: string,
): Promise<Submission | null> {
  const { data, error } = await supabase
    .from("submissions")
    .select("*")
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .maybeSingle();

  if (error || !data) return null;
  return data as Submission;
}

export async function fetchSubmissionRuns(
  userId: string,
  days = 365,
): Promise<SubmissionRun[]> {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const { data, error } = await supabase
    .from("submission_runs")
    .select("*")
    .eq("user_id", userId)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  if (error || !data) return [];
  return data as SubmissionRun[];
}

export { isSeedQuestionId };

export type { TestResult };
