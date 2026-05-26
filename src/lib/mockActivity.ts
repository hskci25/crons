export type ActivityDay = {
  date: Date;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

export type ActivitySummary = {
  total: number;
  longestStreak: number;
  currentStreak: number;
  bestDay: ActivityDay | null;
};

function hashString(input: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t = (t + 0x6d2b79f5) >>> 0;
    let r = t;
    r = Math.imul(r ^ (r >>> 15), r | 1);
    r ^= r + Math.imul(r ^ (r >>> 7), r | 61);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function bucket(count: number): ActivityDay["level"] {
  if (count <= 0) return 0;
  if (count <= 3) return 1;
  if (count <= 8) return 2;
  if (count <= 15) return 3;
  return 4;
}

export function startOfDay(d: Date): Date {
  const copy = new Date(d);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

/**
 * Replace this with a real query (e.g. `select date, count(*) from runs where user_id = ?`)
 * once an activity table exists. For now we generate a deterministic year of data
 * seeded on the user id so each account sees the same pattern between reloads.
 */
export function generateActivity(seedId: string, days = 365): ActivityDay[] {
  const baseSeed = hashString(seedId || "anon");
  const today = startOfDay(new Date());
  const out: ActivityDay[] = [];

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);

    const rng = mulberry32(baseSeed ^ (i * 0x9e3779b1));
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const skipProb = isWeekend ? 0.62 : 0.32;

    let count = 0;
    if (rng() >= skipProb) {
      const tier = rng();
      if (tier < 0.5) count = 1 + Math.floor(rng() * 3);
      else if (tier < 0.82) count = 4 + Math.floor(rng() * 5);
      else if (tier < 0.96) count = 9 + Math.floor(rng() * 7);
      else count = 16 + Math.floor(rng() * 16);
    }

    out.push({ date, count, level: bucket(count) });
  }

  return out;
}

export function summarize(days: ActivityDay[]): ActivitySummary {
  let total = 0;
  let bestDay: ActivityDay | null = null;
  let longestStreak = 0;
  let currentRun = 0;

  for (const d of days) {
    total += d.count;
    if (!bestDay || d.count > bestDay.count) bestDay = d;
    if (d.count > 0) {
      currentRun += 1;
      if (currentRun > longestStreak) longestStreak = currentRun;
    } else {
      currentRun = 0;
    }
  }

  let currentStreak = 0;
  for (let i = days.length - 1; i >= 0; i--) {
    if (days[i].count > 0) currentStreak += 1;
    else break;
  }

  return { total, longestStreak, currentStreak, bestDay };
}

/**
 * Slot days into a fixed 53-column × 7-row grid (Sun..Sat top→bottom),
 * leading nulls fill the first partial week, trailing nulls fill the last.
 */
export function toWeeks(days: ActivityDay[]): Array<Array<ActivityDay | null>> {
  if (days.length === 0) return [];
  const first = days[0];
  const leadingNulls = first.date.getDay(); // 0=Sun

  const flat: Array<ActivityDay | null> = [
    ...Array.from({ length: leadingNulls }, () => null),
    ...days,
  ];
  while (flat.length % 7 !== 0) flat.push(null);

  const weeks: Array<Array<ActivityDay | null>> = [];
  for (let i = 0; i < flat.length; i += 7) {
    weeks.push(flat.slice(i, i + 7));
  }
  return weeks;
}

export function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
