interface RunTestsBarProps {
  passed: number;
  total: number;
  running: boolean;
  canSubmit: boolean;
  submitted: boolean;
  onRun: () => void;
  onSubmit: () => void;
  onResetStarter?: () => void;
}

export default function RunTestsBar({
  passed,
  total,
  running,
  canSubmit,
  submitted,
  onRun,
  onSubmit,
  onResetStarter,
}: RunTestsBarProps) {
  const allPassed = total > 0 && passed === total;
  const progress = total > 0 ? (passed / total) * 100 : 0;

  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5 border-b border-outline-variant/50 bg-[#121212] shrink-0">
      <div className="flex items-center gap-4 min-w-0">
        <div className="flex items-center gap-2">
          <span
            className={`material-symbols-outlined text-[20px] ${
              running
                ? "text-primary animate-spin"
                : allPassed
                  ? "text-tertiary"
                  : total > 0
                    ? "text-primary"
                    : "text-on-surface-variant/50"
            }`}
            style={running ? { animationDuration: "1.5s" } : undefined}
          >
            {running ? "progress_activity" : allPassed ? "check_circle" : "science"}
          </span>
          <div>
            <p className="font-code-md text-label-sm text-on-surface-variant uppercase tracking-wide">
              Test status
            </p>
            <p className="font-code-md text-code-md text-on-surface">
              {total > 0 ? (
                <>
                  <span className={allPassed ? "text-tertiary" : "text-primary"}>
                    {passed}/{total}
                  </span>
                  <span className="text-on-surface-variant"> passed</span>
                </>
              ) : (
                <span className="text-on-surface-variant">Not run yet</span>
              )}
            </p>
          </div>
        </div>

        {total > 0 && (
          <div className="hidden sm:block w-24 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                allPassed ? "bg-tertiary" : "bg-primary-container"
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {submitted && (
          <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-tertiary/15 border border-tertiary/30 px-2.5 py-0.5 font-label-sm text-label-sm text-tertiary uppercase">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Submitted
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onResetStarter && (
          <button
            type="button"
            onClick={onResetStarter}
            title="Restore starter code"
            className="inline-flex items-center gap-1 rounded-lg border border-outline-variant/60 px-3 py-2 text-on-surface-variant font-code-md text-code-md hover:text-on-surface hover:border-outline hover:bg-surface-container-high transition-all"
          >
            <span className="material-symbols-outlined text-[18px]">restart_alt</span>
            <span className="hidden lg:inline">Reset</span>
          </button>
        )}
        <button
          type="button"
          onClick={onRun}
          disabled={running}
          className="inline-flex items-center gap-1.5 rounded-lg border border-outline bg-surface-container-high px-4 py-2 text-on-surface font-code-md text-code-md font-medium hover:border-primary/50 hover:bg-surface-container transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-wait"
        >
          <span className="material-symbols-outlined text-[18px]">
            {running ? "hourglass_top" : "play_arrow"}
          </span>
          {running ? "Running…" : "Run tests"}
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!canSubmit || submitted}
          title={!canSubmit ? "Pass all tests first" : "Mark as complete"}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary-container px-4 py-2 text-on-primary-container font-code-md text-code-md font-bold hover:brightness-110 transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:brightness-100"
        >
          <span className="material-symbols-outlined text-[18px]">task_alt</span>
          Submit
        </button>
      </div>
    </div>
  );
}
