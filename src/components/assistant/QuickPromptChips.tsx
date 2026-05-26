const PROMPTS = [
  "Where should I start reading this repo?",
  "Why did my last test fail?",
  "Give me a hint without the full answer",
];

interface QuickPromptChipsProps {
  onSelect: (text: string) => void;
  disabled?: boolean;
}

export default function QuickPromptChips({
  onSelect,
  disabled,
}: QuickPromptChipsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-3 py-2 border-b border-outline-variant">
      {PROMPTS.map((p) => (
        <button
          key={p}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(p)}
          className="px-2 py-1 border border-outline-variant text-on-surface-variant font-code-md text-label-sm hover:border-primary-container hover:text-primary transition-colors disabled:opacity-40"
        >
          {p}
        </button>
      ))}
    </div>
  );
}
