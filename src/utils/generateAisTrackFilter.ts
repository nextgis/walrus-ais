import { getMonthDateRange } from './getMonthDateRange';

import type { PropertiesFilter } from '@nextgis/properties-filter';
import type { AisTrackProperties, DateDict } from '../interfaces';

export function generateAisTrackFilter(
  date: DateDict,
): PropertiesFilter<AisTrackProperties> {
  const filter: PropertiesFilter<AisTrackProperties> = [];
  const [from, to] = getMonthDateRange(date).map((x) => x / 1000);

  const middleFilter: PropertiesFilter<AisTrackProperties> = [
    ['date_begin', 'ge', from],
    ['date_end', 'le', to],
  ];
  filter.push(['any', middleFilter]);

  return filter;
}
