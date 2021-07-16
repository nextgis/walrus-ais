import type { AisLayerItem, DateDict } from '../interfaces';

export function findAisLayerByDate(
  aisLayerItems: AisLayerItem[],
  date: DateDict,
): AisLayerItem | null {
  if (date) {
    const { year, month } = date;
    if ([year, month].every((x) => x)) {
      const exist = aisLayerItems.find(
        (x) => x.year === year && x.month === month,
      );
      return exist || null;
    }
  }
  return null;
}
