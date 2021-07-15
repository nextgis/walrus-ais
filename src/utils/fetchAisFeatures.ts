import { groupResource } from '../config';
import connector from '../services/connector';
import { parseDateFromResourceName } from '../utils/parseDateFromResourceName';

import type { DateDict, AisLayerItem } from '../interfaces';

const dateStr = (dt: DateDict) => '' + dt.year + dt.month;

export function fetchAisFeatures() {
  return connector.getResourceChildren(groupResource).then((data) => {
    const items: AisLayerItem[] = [];
    for (const i of data) {
      const res = i.resource;
      if (
        res.cls === 'vector_layer' &&
        res.display_name.startsWith('ASTD_area_level')
      ) {
        items.push({
          resource: res.id,
          name: res.display_name,
          ...parseDateFromResourceName(res.display_name),
        });
      }
    }
    items.sort((a, b) => (dateStr(b) > dateStr(a) ? 1 : -1));
    return items;
  });
}
