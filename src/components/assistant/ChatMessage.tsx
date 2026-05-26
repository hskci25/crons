interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
}

export default function ChatMessageBubble({ role, content }: ChatMessageProps) {
  const isUser = role === "user";
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} px-3 py-1.5`}
    >
      <div
        className={`max-w-[95%] px-3 py-2 font-body-md text-body-md whitespace-pre-wrap ${
          isUser
            ? "bg-primary-container/20 text-on-surface border border-primary-container/30"
            : "bg-surface-container-low text-on-surface-variant border border-outline-variant"
        }`}
      >
        {!isUser && (
          <span className="block font-label-sm text-label-sm text-primary uppercase tracking-widest mb-1">
            Assistant
          </span>
        )}
        {content}
      </div>
    </div>
  );
}
