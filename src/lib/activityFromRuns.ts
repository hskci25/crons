import type { SubmissionRun } from "./types/questions";
import {
  type ActivityDay,
  type ActivitySummary,
  summarize,
  bucket,
  startOfDay,
} from "./mockActivity";

export function runsToActivityDays(
  runs: SubmissionRun[],
  daysBack = 365,
): ActivityDay[] {
  const counts = new Map<string, number>();
  for (const run of runs) {
    const d = startOfDay(new Date(run.created_at));
    const key = d.toISOString().slice(0, 10);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  const end = startOfDay(new Date());
  const start = new Date(end);
  start.setDate(start.getDate() - daysBack + 1);

  const out: ActivityDay[] = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const key = cursor.toISOString().slice(0, 10);
    const count = counts.get(key) ?? 0;
    out.push({
      date: new Date(cursor),
      count,
      level: bucket(count),
    });
    cursor.setDate(cursor.getDate() + 1);
  }
  return out;
}

export function summarizeRuns(runs: SubmissionRun[]): ActivitySummary {
  return summarize(runsToActivityDays(runs));
}
