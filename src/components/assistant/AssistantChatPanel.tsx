import { useEffect, useRef, useState } from "react";
import {
  fetchChatMessages,
  getOrCreateThread,
  saveChatMessage,
  sendChatMessage,
  type ChatContext,
} from "../../lib/chat";
import type { ChatMessage as ChatMessageType } from "../../lib/types/questions";
import ChatMessageBubble from "./ChatMessage";
import QuickPromptChips from "./QuickPromptChips";

interface AssistantChatPanelProps {
  open: boolean;
  onClose: () => void;
  userId: string;
  questionId: string;
  questionSlug: string;
  context: ChatContext;
}

export default function AssistantChatPanel({
  open,
  onClose,
  userId,
  questionId,
  questionSlug,
  context,
}: AssistantChatPanelProps) {
  const [threadId, setThreadId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open || !userId) return;
    let cancelled = false;
    (async () => {
      const tid = await getOrCreateThread(userId, questionId);
      if (cancelled || !tid) return;
      setThreadId(tid);
      const msgs = await fetchChatMessages(tid);
      if (!cancelled) setMessages(msgs);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, userId, questionId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, sending]);

  async function handleSend(text: string) {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setError(null);
    setSending(true);
    setInput("");

    const userMsg: ChatMessageType = {
      id: `local-${Date.now()}`,
      thread_id: threadId ?? "",
      role: "user",
      content: trimmed,
      created_at: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);

    try {
      const history = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const reply = await sendChatMessage(
        questionSlug,
        trimmed,
        context,
        history.slice(-20),
      );

      const assistantMsg: ChatMessageType = {
        id: `local-a-${Date.now()}`,
        thread_id: threadId ?? "",
        role: "assistant",
        content: reply,
        created_at: new Date().toISOString(),
      };
      setMessages((m) => [...m, assistantMsg]);

      if (threadId) {
        await saveChatMessage(threadId, "user", trimmed);
        await saveChatMessage(threadId, "assistant", reply);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send");
    } finally {
      setSending(false);
    }
  }

  if (!open) return null;

  return (
    <div className="flex flex-col h-full w-full min-h-0 bg-surface-container-lowest">
      <div className="flex items-center justify-between px-4 py-3 border-b border-outline-variant shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-tertiary" />
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
            Assistant
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-on-surface-variant hover:text-on-surface font-code-md"
          aria-label="Close assistant"
        >
          ×
        </button>
      </div>

      <QuickPromptChips onSelect={handleSend} disabled={sending} />

      <div className="flex-1 overflow-y-auto py-2 min-h-0">
        {messages.length === 0 && (
          <p className="px-4 py-6 font-body-md text-body-md text-on-surface-variant/70">
            Ask about the problem, your approach, or failing tests. I won&apos;t
            give away full solutions.
          </p>
        )}
        {messages.map((m) => (
          <ChatMessageBubble key={m.id} role={m.role} content={m.content} />
        ))}
        {sending && (
          <p className="px-4 py-2 font-code-md text-label-sm text-on-surface-variant animate-pulse">
            Thinking…
          </p>
        )}
        <div ref={bottomRef} />
      </div>

      {error && (
        <p className="px-3 py-1 text-error font-code-md text-label-sm">{error}</p>
      )}

      <form
        className="p-3 border-t border-outline-variant shrink-0"
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={2}
          placeholder="Ask a question…"
          className="w-full bg-surface-container-low border border-surface-container-high px-3 py-2 font-code-md text-code-md text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:border-primary-container resize-none"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="mt-2 w-full py-2 bg-primary-container text-on-primary-container font-code-md text-code-md font-bold hover:brightness-90 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}
