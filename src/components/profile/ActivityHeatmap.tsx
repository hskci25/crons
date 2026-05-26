import { useMemo, useState } from "react";
import {
  type ActivityDay,
  formatDate,
  generateActivity,
  summarize,
  toWeeks,
} from "../../lib/mockActivity";

const LEVEL_BG: Record<ActivityDay["level"], string> = {
  0: "bg-[#1a1a1a]",
  1: "bg-[#3a1e08]",
  2: "bg-[#7a3c10]",
  3: "bg-[#c46220]",
  4: "bg-[#E8720C]",
};

const MONTH_LABELS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export default function ActivityHeatmap({
  seedId,
  days: daysProp,
}: {
  seedId: string;
  days?: ActivityDay[];
}) {
  const days = useMemo(
    () => daysProp ?? generateActivity(seedId, 365),
    [seedId, daysProp],
  );
  const summary = useMemo(() => summarize(days), [days]);
  const weeks = useMemo(() => toWeeks(days), [days]);
  const [hover, setHover] = useState<ActivityDay | null>(null);

  const monthMarkers = useMemo(() => {
    const seen = new Set<number>();
    return weeks.map((week, idx) => {
      const firstReal = week.find(Boolean) as ActivityDay | undefined;
      if (!firstReal) return null;
      const month = firstReal.date.getMonth();
      if (seen.has(month)) return null;
      seen.add(month);
      return { col: idx, label: MONTH_LABELS[month] };
    });
  }, [weeks]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <p className="font-code-md text-code-md text-on-surface-variant">
          <span className="text-primary font-bold">{summary.total.toLocaleString()}</span>{" "}
          contributions in the last year
        </p>
        <p
          aria-live="polite"
          className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest min-h-[1em]"
        >
          {hover
            ? `${hover.count} contribution${hover.count === 1 ? "" : "s"} on ${formatDate(hover.date)}`
            : "Hover a day for details"}
        </p>
      </div>

      <div className="overflow-x-auto -mx-2 px-2 pb-2">
        <div className="inline-block min-w-full">
          <div
            className="grid grid-cols-[auto_1fr] gap-x-2"
            style={{ minWidth: "fit-content" }}
          >
            <div />
            <div
              className="relative h-4 font-label-sm text-label-sm text-on-surface-variant opacity-60"
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${weeks.length}, 13px)`,
                columnGap: "2px",
              }}
            >
              {monthMarkers.map((m, i) =>
                m ? (
                  <span
                    key={`${m.col}-${m.label}`}
                    style={{ gridColumn: m.col + 1 }}
                  >
                    {m.label}
                  </span>
                ) : (
                  <span key={`empty-${i}`} />
                ),
              )}
            </div>

            <div className="grid grid-rows-7 gap-[2px] pr-2 font-label-sm text-label-sm text-on-surface-variant opacity-60 select-none">
              <span className="invisible h-[11px]">S</span>
              <span className="h-[11px] leading-[11px]">M</span>
              <span className="invisible h-[11px]">T</span>
              <span className="h-[11px] leading-[11px]">W</span>
              <span className="invisible h-[11px]">T</span>
              <span className="h-[11px] leading-[11px]">F</span>
              <span className="invisible h-[11px]">S</span>
            </div>

            <div
              className="grid grid-flow-col grid-rows-7 gap-[2px]"
              role="grid"
              aria-label="Contribution activity, past year"
              onMouseLeave={() => setHover(null)}
            >
              {weeks.flatMap((week, wi) =>
                week.map((day, di) =>
                  day ? (
                    <div
                      key={`${wi}-${di}`}
                      role="gridcell"
                      tabIndex={0}
                      onMouseEnter={() => setHover(day)}
                      onFocus={() => setHover(day)}
                      title={`${day.count} contribution${day.count === 1 ? "" : "s"} on ${formatDate(day.date)}`}
                      className={`w-[11px] h-[11px] ${LEVEL_BG[day.level]} hover:outline hover:outline-1 hover:outline-primary focus:outline focus:outline-1 focus:outline-primary cursor-pointer transition-colors`}
                    />
                  ) : (
                    <div
                      key={`${wi}-${di}-empty`}
                      aria-hidden="true"
                      className="w-[11px] h-[11px] bg-transparent"
                    />
                  ),
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest opacity-70">
        <span>Less</span>
        {([0, 1, 2, 3, 4] as const).map((lvl) => (
          <span
            key={lvl}
            className={`w-[11px] h-[11px] ${LEVEL_BG[lvl]}`}
            aria-hidden="true"
          />
        ))}
        <span>More</span>
      </div>
    </div>
  );
}
