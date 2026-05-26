import { supabase } from "./supabase";
import type { ChatMessage, RunTestsResponse } from "./types/questions";

export interface ChatContext {
  specMd: string;
  title: string;
  difficulty: string;
  tags: string[];
  files: Record<string, string>;
  lastRunResults?: RunTestsResponse | null;
}

export async function fetchChatMessages(
  threadId: string,
): Promise<ChatMessage[]> {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("thread_id", threadId)
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) return [];
  return (data ?? []) as ChatMessage[];
}

export async function getOrCreateThread(
  userId: string,
  questionId: string,
): Promise<string | null> {
  const { data: existing } = await supabase
    .from("chat_threads")
    .select("id")
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .maybeSingle();

  if (existing?.id) return existing.id as string;

  const { data, error } = await supabase
    .from("chat_threads")
    .insert({ user_id: userId, question_id: questionId })
    .select("id")
    .single();

  if (error) return null;
  return data.id as string;
}

export async function saveChatMessage(
  threadId: string,
  role: "user" | "assistant",
  content: string,
): Promise<ChatMessage | null> {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert({ thread_id: threadId, role, content })
    .select()
    .single();

  if (error) return null;
  return data as ChatMessage;
}

export async function sendChatMessage(
  questionSlug: string,
  message: string,
  context: ChatContext,
  history: { role: "user" | "assistant"; content: string }[],
): Promise<string> {
  const { data: session } = await supabase.auth.getSession();
  const token = session.session?.access_token;

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ questionSlug, message, context, history }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      (err as { error?: string }).error ?? `Chat failed (${res.status})`,
    );
  }

  const json = (await res.json()) as { content: string };
  return json.content;
}
