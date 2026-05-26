export type Difficulty = "easy" | "medium" | "hard";
export type FileKind = "starter" | "readonly" | "hidden_test";
export type SubmissionStatus = "in_progress" | "passed";
export type ChatRole = "user" | "assistant";

export interface Question {
  id: string;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  language: string;
  spec_md: string;
  time_limit_min: number | null;
  published: boolean;
  created_at: string;
}

export interface QuestionFile {
  id: string;
  question_id: string;
  path: string;
  content: string;
  kind: FileKind;
}

export interface QuestionWithFiles extends Question {
  files: QuestionFile[];
}

export interface TestResult {
  name: string;
  status: "passed" | "failed" | "skipped";
  ms?: number;
  message?: string;
}

export interface RunTestsResponse {
  passed: number;
  total: number;
  results: TestResult[];
  stdout?: string;
  compileError?: string;
  durationMs?: number;
}

export interface Submission {
  id: string;
  user_id: string;
  question_id: string;
  status: SubmissionStatus;
  files: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface SubmissionRun {
  id: string;
  user_id: string;
  question_id: string;
  submission_id: string | null;
  passed: number;
  total: number;
  results: TestResult[];
  stdout: string | null;
  duration_ms: number | null;
  created_at: string;
}

export interface ChatThread {
  id: string;
  user_id: string;
  question_id: string;
  created_at: string;
}

export interface ChatMessage {
  id: string;
  thread_id: string;
  role: ChatRole;
  content: string;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}
