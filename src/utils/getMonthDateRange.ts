import type { DateDict } from '../interfaces';

export function getMonthDateRange(date: DateDict): [number, number] {
  const dt = new Date(Number(date.year), Number(date.month));
  const y = dt.getFullYear();
  const m = dt.getMonth();
  const firstDay = new Date(y, m, 1).getTime();
  const lastDay = new Date(y, m + 1, 0).getTime();
  return [firstDay, lastDay];
}
