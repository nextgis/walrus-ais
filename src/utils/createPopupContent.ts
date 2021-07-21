import { defined } from '@nextgis/utils';
import connector from '../services/connector';

import type { CreatePopupContentProps } from '@nextgis/webmap';

export function createPopupContent<
  P extends Record<any, any> = Record<string, string>,
>({
  resource,
  aliases = {},
  getProp = {},
}: {
  resource: number;
  aliases?: Partial<Record<keyof P, string>>;
  getProp?: Partial<Record<keyof P, (val: any) => string | HTMLElement>>;
}) {
  return async (props: CreatePopupContentProps): Promise<HTMLElement> => {
    const html = document.createElement('table');
    const tbody = document.createElement('tbody');
    html.className = 'table is-fullwidth';
    html.style.marginBottom = '0';
    const feature = props.feature;
    if (feature && feature.properties) {
      const res = await connector.getResource(resource);
      if (res && res.feature_layer) {
        const fields = res.feature_layer.fields;

        for (let i = 0; i < fields.length; i++) {
          const field = fields[i];
          const key = field.keyname;
          const featureProp = feature.properties[key];
          const propFunc = getProp[key];
          const prop = propFunc ? propFunc(featureProp) : featureProp;

          if (defined(prop) && field.grid_visibility) {
            const displayName = field.display_name;
            const name =
              displayName === key ? aliases[key] || displayName : displayName;

            const tr = document.createElement('tr');
            const tdName = document.createElement('td');
            const tdVal = document.createElement('td');
            tdName.innerHTML = name;
            if (prop instanceof HTMLElement) {
              tdVal.appendChild(prop);
            } else {
              tdVal.innerHTML = prop;
            }
            tr.appendChild(tdName);
            tr.appendChild(tdVal);
            tbody.appendChild(tr);
          }
        }
        html.appendChild(tbody);
      }
    }
    return html;
  };
}
