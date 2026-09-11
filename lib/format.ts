export function titleCaseMonth(month: string): string {
  return month.charAt(0).toUpperCase() + month.slice(1);
}

export function monthOrder(month: string, year: number): number {
  const months = [
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
  ];
  return year * 12 + months.indexOf(month.toLowerCase());
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
