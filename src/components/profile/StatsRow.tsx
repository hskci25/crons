type Stat = { label: string; value: string; unit?: string };

export default function StatsRow({ stats }: { stats: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-outline-variant border border-outline-variant">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-background p-5 flex flex-col gap-2"
        >
          <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest opacity-70">
            {s.label}
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-code-md text-2xl md:text-3xl font-bold text-on-surface tracking-tight">
              {s.value}
            </span>
            {s.unit && (
              <span className="font-code-md text-code-md text-on-surface-variant opacity-60">
                {s.unit}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
