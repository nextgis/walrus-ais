import type { DateDict } from '../interfaces';

export function parseDateFromResourceName(str: string): DateDict {
  // const tmp = 'ASTD_area_level3_'; // 201505
  // ugly but fast
  const l = 17; // tmp.length
  const year = str[l + 0] + str[l + 1] + str[l + 2] + str[l + 3];
  const month = str[l + 4] + str[l + 5];
  return { year, month };
}
