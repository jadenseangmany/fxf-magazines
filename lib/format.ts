export const MONTHS = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
] as const;

export type MonthName = (typeof MONTHS)[number];

export function isMonth(value: string): value is MonthName {
  return (MONTHS as readonly string[]).includes(value.toLowerCase());
}

export function titleCaseMonth(month: string): string {
  return month.charAt(0).toUpperCase() + month.slice(1);
}

export function monthOrder(month: string, year: number): number {
  return year * 12 + MONTHS.indexOf(month.toLowerCase() as MonthName);
}

export function sortMagazines<T extends { month: string; year: number }>(
  magazines: T[],
): T[] {
  return [...magazines].sort(
    (a, b) => monthOrder(b.month, b.year) - monthOrder(a.month, a.year),
  );
}

export function toSlug(month: string, year: number): string {
  return `${month.toLowerCase()}-${year}`;
}

export function currentMonthYear(now = new Date()): {
  month: MonthName;
  year: number;
} {
  return {
    month: MONTHS[now.getMonth()] ?? "january",
    year: now.getFullYear(),
  };
}
