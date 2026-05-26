import type { RunTestsResponse } from "../../lib/types/questions";

interface TestResultsPanelProps {
  lastRun: RunTestsResponse | null;
  compileError?: string;
  height?: number;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-6 text-center px-4">
      <span className="material-symbols-outlined text-[32px] text-on-surface-variant/25 mb-2">
        science
      </span>
      <p className="font-code-md text-label-sm text-on-surface-variant/60">
        Run tests to see results here
      </p>
    </div>
  );
}

export default function TestResultsPanel({
  lastRun,
  compileError,
  height,
}: TestResultsPanelProps) {
  const panelStyle = height ? { height, minHeight: height, maxHeight: height } : undefined;
  const scrollClass = height ? "h-full overflow-y-auto" : "max-h-52 overflow-y-auto";

  if (compileError) {
    return (
      <div
        className={`border-t border-error/30 bg-error/5 flex flex-col shrink-0 ${scrollClass}`}
        style={panelStyle}
      >
        <div className="shrink-0 flex items-center gap-2 px-4 py-2 border-b border-error/20 bg-error/10">
          <span className="material-symbols-outlined text-error text-[20px]">
            error
          </span>
          <span className="font-label-sm text-label-sm text-error uppercase tracking-widest">
            Compile error
          </span>
        </div>
        <pre className="p-4 font-code-md text-label-sm text-error/90 whitespace-pre-wrap leading-relaxed">
          {compileError}
        </pre>
      </div>
    );
  }

  if (!lastRun) {
    return (
      <div
        className={`border-t border-outline-variant/50 bg-[#121212] shrink-0 ${scrollClass}`}
        style={panelStyle}
      >
        <EmptyState />
      </div>
    );
  }

  const allPassed = lastRun.total > 0 && lastRun.passed === lastRun.total;

  return (
    <div
      className={`border-t border-outline-variant/50 bg-[#121212] shrink-0 flex flex-col ${scrollClass}`}
      style={panelStyle}
    >
      <div
        className={`shrink-0 flex items-center justify-between px-4 py-2 border-b border-outline-variant/40 ${
          allPassed ? "bg-tertiary/5" : "bg-surface-container-high/30"
        }`}
      >
        <div className="flex items-center gap-2">
          <span
            className={`material-symbols-outlined text-[20px] ${
              allPassed ? "text-tertiary" : "text-primary"
            }`}
          >
            {allPassed ? "check_circle" : "list_alt"}
          </span>
          <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant">
            Test results
          </span>
        </div>
        <span
          className={`font-code-md text-code-md ${
            allPassed ? "text-tertiary" : "text-primary"
          }`}
        >
          {lastRun.passed}/{lastRun.total}
        </span>
      </div>

      <div className="p-4 flex-1">
        {lastRun.total > 0 && (
          <p className="font-code-md text-label-sm text-on-surface-variant/60 mb-3 leading-relaxed">
            Visible tests shown below. Hidden cases run on the server and are not
            listed in the file tree.
          </p>
        )}
        <ul className="space-y-1.5">
          {lastRun.results.map((r) => (
            <li
              key={r.name}
              className={`flex items-start gap-2.5 rounded-lg px-3 py-2 font-code-md text-label-sm ${
                r.status === "failed"
                  ? "bg-error/10 border border-error/20"
                  : r.status === "passed"
                    ? "bg-tertiary/5 border border-transparent"
                    : "border border-transparent"
              }`}
            >
              <span
                className={`material-symbols-outlined text-[18px] shrink-0 mt-0.5 ${
                  r.status === "passed"
                    ? "text-tertiary"
                    : r.status === "failed"
                      ? "text-error"
                      : "text-on-surface-variant"
                }`}
              >
                {r.status === "passed"
                  ? "check_circle"
                  : r.status === "failed"
                    ? "cancel"
                    : "radio_button_unchecked"}
              </span>
              <div className="min-w-0 flex-1">
                <span className="text-on-surface block truncate">
                  {r.name.split(".").pop() ?? r.name}
                  {r.name.includes("Hidden") && (
                    <span className="ml-2 text-on-surface-variant/50 text-label-sm font-normal">
                      hidden
                    </span>
                  )}
                </span>
                {r.message && r.message.length > 3 && (
                  <p
                    className="text-on-surface-variant/70 mt-1 text-label-sm leading-snug line-clamp-2"
                    title={r.message}
                  >
                    {r.message}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
