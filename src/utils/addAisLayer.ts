import { fetchNgwLayerFeatures } from '@nextgis/ngw-kit';
import { AIS_ALIASES, AIS_DEF_FILTER_DATA, AIS_LAYER_ID } from '../constants';
import { getShipidColor } from './getShipidColor';
import { createPopupContent } from './createPopupContent';

import type { FeatureCollection, Point } from 'geojson';
import type { NgwMap } from '@nextgis/ngw-map';
import type { Expression, Paint } from '@nextgis/paint';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type CancelablePromise from '@nextgis/cancelable-promise';
import type { AisProperties, AstdCat } from '../interfaces';
import { generateFilter } from './generateFilter';

export function addAisLayer({
  ngwMap,
  resource,
  filter,
}: {
  ngwMap: NgwMap;
  resource: number;
  filter: PropertiesFilter;
}): CancelablePromise<void> {
  return fetchNgwLayerFeatures<Point, AisProperties>({
    connector: ngwMap.connector,
    resourceId: resource,
    fields: ['shipid', 'astd_cat', 'iceclass', 'sizegroup', 'fuelq'],
    // load optimization. Only for full filter values
    filters: generateFilter(AIS_DEF_FILTER_DATA),
    limit: 60000,
    cache: true,
  }).then((features) => {
    const astdCatList: AstdCat[] = [];
    const color: Expression = ['match', ['get', 'shipid']];
    const shipidList: string[] = [];
    for (const f of features) {
      const shipid = f.properties['shipid'];
      const astdCat = f.properties['astd_cat'];
      if (!shipidList.includes(shipid)) {
        shipidList.push(shipid);
        color.push(shipid);
        color.push(getShipidColor(shipid));
      }
      if (!astdCatList.includes(astdCat)) {
        astdCatList.push(astdCat);
      }
    }
    // last item is default value
    color.push('gray');
    const data: FeatureCollection<Point, AisProperties> = {
      type: 'FeatureCollection',
      features,
    };

    const paint: Paint = {
      color,
      stroke: true,
      strokeColor: 'white',
      opacity: 1,
      radius: 4,
    };
    ngwMap
      .addGeoJsonLayer({
        id: AIS_LAYER_ID,
        data,
        order: 10,
        paint,
        selectedPaint: { ...paint, radius: 7 },
        selectable: true,
        popupOnSelect: true,
        popupOptions: {
          createPopupContent: createPopupContent({
            resource,
            aliases: AIS_ALIASES,
            getProp: {
              shipid: (val: string) => {
                const elem = document.createElement('div');
                const color = getShipidColor(val);
                elem.innerHTML = `${val} <span style="display: inline-block;background-color: ${color}; width: 10px; height: 10px; border-radius: 50%;"></span>`;
                return elem;
              },
            },
          }),
        },
      })
      .then(() => {
        ngwMap.propertiesFilter(AIS_LAYER_ID, filter);
      });
  });
}
