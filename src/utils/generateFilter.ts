import type { PropertiesFilter } from '@nextgis/properties-filter';

export function generateFilter<F extends Record<any, any> = Record<any, any>>(
  data: F,
): PropertiesFilter {
  const filter: PropertiesFilter = [];
  let key: keyof F;
  for (key in data) {
    if (key !== 'fuelq') {
      filter.push([key, 'in', data[key]]);
    }
  }

  return filter;
}
