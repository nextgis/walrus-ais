import type { DateDict } from '../interfaces';

export function getMonthDateRange(date: DateDict): [number, number] {
  const y = Number(date.year);
  const m = Number(date.month) - 1;
  const firstDay = new Date(y, m, 1);
  const lastDay = new Date(y, m + 1, 0);
  return [firstDay.getTime(), lastDay.getTime()];
}
