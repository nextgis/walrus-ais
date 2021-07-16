import type { AisCalendar, AisLayerItem } from '../interfaces';

export function createAisCalendar(aisLayerItems: AisLayerItem[]): AisCalendar {
  const calendar: AisCalendar = {};
  const years: string[] = [];
  for (const d of aisLayerItems) {
    const exist = calendar[d.year];
    if (!exist) {
      calendar[d.year] = [];
      years.push(d.year);
    }
    calendar[d.year].push(d.month);
  }
  return calendar;
}
