interface QuestionSpecPanelProps {
  title: string;
  difficulty: string;
  tags: string[];
  specMd: string;
}

function renderMarkdownLite(md: string) {
  return md.split("\n").map((line, i) => {
    if (line.startsWith("# ")) {
      return (
        <h2 key={i} className="font-headline-sm text-headline-sm text-on-surface mb-4 mt-2">
          {line.slice(2)}
        </h2>
      );
    }
    if (line.startsWith("## ")) {
      return (
        <h3 key={i} className="font-code-md text-code-md font-bold text-primary mt-6 mb-2 uppercase tracking-wider">
          {line.slice(3)}
        </h3>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={i} className="ml-4 list-disc text-on-surface-variant">
          {line.slice(2)}
        </li>
      );
    }
    const withCode = line.split(/(`[^`]+`)/g).map((part, j) =>
      part.startsWith("`") && part.endsWith("`") ? (
        <code
          key={j}
          className="font-code-md bg-surface-container-high px-1 text-primary text-sm"
        >
          {part.slice(1, -1)}
        </code>
      ) : (
        <span key={j}>{part}</span>
      ),
    );
    if (!line.trim()) return <br key={i} />;
    return (
      <p key={i} className="font-body-md text-body-md text-on-surface-variant mb-3">
        {withCode}
      </p>
    );
  });
}

export default function QuestionSpecPanel({
  title,
  difficulty,
  tags,
  specMd,
}: QuestionSpecPanelProps) {
  return (
    <div className="flex flex-col h-full overflow-hidden border-r border-outline-variant bg-surface-container-lowest">
      <div className="p-6 border-b border-outline-variant shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-2 h-2 bg-primary-container" />
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
            Technical Specification
          </span>
        </div>
        <h1 className="font-headline-sm text-headline-sm text-on-surface mb-3">
          {title}
        </h1>
        <div className="flex flex-wrap gap-2">
          <span className="px-2 py-0.5 border border-primary-container/50 text-primary font-code-md text-label-sm uppercase">
            {difficulty}
          </span>
          {tags.map((t) => (
            <span
              key={t}
              className="px-2 py-0.5 border border-outline-variant text-on-surface-variant font-code-md text-label-sm"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">{renderMarkdownLite(specMd)}</div>
    </div>
  );
}
