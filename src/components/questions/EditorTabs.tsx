interface EditorTabsProps {
  tabs: string[];
  activePath: string | null;
  readonlyPaths: Set<string>;
  onSelect: (path: string) => void;
  onClose: (path: string) => void;
}

export default function EditorTabs({
  tabs,
  activePath,
  readonlyPaths,
  onSelect,
  onClose,
}: EditorTabsProps) {
  if (tabs.length === 0) return null;

  return (
    <div className="flex items-center gap-1 px-2 py-1.5 border-b border-outline-variant/50 bg-[#121212] overflow-x-auto shrink-0">
      {tabs.map((tab) => {
        const name = tab.split("/").pop() ?? tab;
        const active = tab === activePath;
        const ro = readonlyPaths.has(tab);
        return (
          <div
            key={tab}
            className={`group flex items-center gap-1 rounded-md pl-2.5 pr-1 py-1 shrink-0 transition-colors ${
              active
                ? "bg-[#0A0A0A] border border-outline-variant/60 text-on-surface"
                : "text-on-surface-variant hover:text-on-surface hover:bg-surface-container-high/60 border border-transparent"
            }`}
          >
            <button
              type="button"
              onClick={() => onSelect(tab)}
              className="flex items-center gap-1.5 font-code-md text-label-sm truncate max-w-[160px]"
            >
              {ro ? (
                <span className="material-symbols-outlined text-[14px] text-on-surface-variant/50">
                  lock
                </span>
              ) : (
                <span className="material-symbols-outlined text-[14px] text-primary/70">
                  edit
                </span>
              )}
              {name}
            </button>
            {tabs.length > 1 && (
              <button
                type="button"
                onClick={() => onClose(tab)}
                className="flex h-5 w-5 items-center justify-center rounded opacity-0 group-hover:opacity-60 hover:!opacity-100 hover:bg-surface-container-high transition-opacity"
                aria-label={`Close ${name}`}
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
