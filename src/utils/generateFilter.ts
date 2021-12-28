import type { PropertiesFilter } from '@nextgis/properties-filter';

export function generateFilter<F extends Record<any, any> = Record<any, any>>(
  data: F,
): PropertiesFilter<F> {
  const filter: PropertiesFilter = [];
  for (const key in data) {
    filter.push([key, 'in', data[key]]);
  }
  return filter;
}
