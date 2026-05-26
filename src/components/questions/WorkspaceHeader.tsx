import { Link } from "react-router-dom";
import {
  DIFFICULTY_STYLES,
  formatQuestionTitle,
  type Difficulty,
} from "../../lib/questionDisplay";

interface WorkspaceHeaderProps {
  title: string;
  slug: string;
  difficulty: string;
  chatOpen: boolean;
  onToggleChat: () => void;
  showChatToggle: boolean;
}

export default function WorkspaceHeader({
  title,
  slug,
  difficulty,
  chatOpen,
  onToggleChat,
  showChatToggle,
}: WorkspaceHeaderProps) {
  const diff = DIFFICULTY_STYLES[difficulty as Difficulty] ?? DIFFICULTY_STYLES.medium;
  const displayTitle = formatQuestionTitle(title || slug);

  return (
    <header className="flex items-center justify-between gap-4 px-4 h-12 shrink-0 border-b border-outline-variant/60 bg-surface-container-low/95 backdrop-blur-sm">
      <div className="flex items-center gap-3 min-w-0">
        <Link
          to="/questions"
          className="inline-flex items-center gap-1 rounded-lg px-2 py-1.5 font-code-md text-code-md text-on-surface-variant hover:text-primary hover:bg-surface-container-high transition-colors shrink-0"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          <span className="hidden sm:inline">Challenges</span>
        </Link>
        <span className="text-outline-variant/60 hidden sm:inline">/</span>
        <div className="min-w-0 flex items-center gap-2">
          <h1 className="font-headline-sm text-headline-sm text-on-surface truncate">
            {displayTitle}
          </h1>
          <span
            className={`hidden md:inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-label-sm text-label-sm ${diff.badge}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${diff.dot}`} />
            {diff.label}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {showChatToggle && (
          <button
            type="button"
            onClick={onToggleChat}
            className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 font-code-md text-code-md transition-all ${
              chatOpen
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-outline-variant text-on-surface-variant hover:text-on-surface hover:border-outline"
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">
              {chatOpen ? "forum" : "smart_toy"}
            </span>
            <span className="hidden sm:inline">
              {chatOpen ? "Assistant" : "Ask AI"}
            </span>
          </button>
        )}
      </div>
    </header>
  );
}
