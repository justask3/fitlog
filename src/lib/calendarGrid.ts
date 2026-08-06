export const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export const DAY_MS = 86_400_000;

export type WeekStart = "sunday" | "monday";

export type Cell = { day: number; epoch: number } | null;

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** JS Date.getDay() is Sunday-first (0-6); shift the column index when the week starts Monday. */
export function columnIndex(jsDay: number, weekStart: WeekStart): number {
  return weekStart === "sunday" ? jsDay : (jsDay + 6) % 7;
}

export function buildMonthGrid(
  year: number,
  month: number,
  weekStart: WeekStart
): Cell[][] {
  const total = daysInMonth(year, month);
  const leading = columnIndex(new Date(year, month, 1).getDay(), weekStart);
  const cells: Cell[] = Array(leading).fill(null);
  for (let d = 1; d <= total; d++) {
    cells.push({ day: d, epoch: Math.floor(new Date(year, month, d).getTime() / DAY_MS) });
  }
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: Cell[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  return weeks;
}

export function weekdayLabels(weekStart: WeekStart): string[] {
  return weekStart === "sunday"
    ? ["S", "M", "T", "W", "T", "F", "S"]
    : ["M", "T", "W", "T", "F", "S", "S"];
}

type ActivityRow = { date: Date; category: string; workoutId: string };

export type MonthKey = { year: number; month: number };

/** A fixed window of months centered on today — independent of what's actually logged, so past AND future months are always browsable. */
export function getMonthsWindow(yearsBack = 3, yearsForward = 3): MonthKey[] {
  const now = new Date();
  const months: MonthKey[] = [];
  let y = now.getFullYear() - yearsBack;
  let m = now.getMonth();
  const endY = now.getFullYear() + yearsForward;
  while (y < endY || (y === endY && m <= now.getMonth())) {
    months.push({ year: y, month: m });
    m++;
    if (m > 11) {
      m = 0;
      y++;
    }
  }
  return months;
}

export function currentMonthIndex(months: MonthKey[]): number {
  const now = new Date();
  return months.findIndex((mo) => mo.year === now.getFullYear() && mo.month === now.getMonth());
}

/** Epoch-day -> distinct exercise categories logged that day. */
export function buildCategoriesByDay(rows: ActivityRow[]): Map<number, string[]> {
  const map = new Map<number, string[]>();
  for (const r of rows) {
    const key = Math.floor(r.date.getTime() / DAY_MS);
    const existing = map.get(key);
    if (existing) {
      if (!existing.includes(r.category)) existing.push(r.category);
    } else {
      map.set(key, [r.category]);
    }
  }
  return map;
}
