import { fetchNgwLayerFeatures } from '@nextgis/ngw-kit';
import { AIS_ALIASES } from '../constants';
import { getShipidColor } from './getShipidColor';
import { secondsToDateString } from './secondsToDateString';
import { createPopupContent } from './createPopupContent';

import type { FeatureCollection, Point, LineString } from 'geojson';
import type { NgwMap } from '@nextgis/ngw-map';
import type { VectorAdapterLayerType } from '@nextgis/webmap';
import type { Expression, Paint, CirclePaint, PathPaint } from '@nextgis/paint';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type CancelablePromise from '@nextgis/cancelable-promise';
import type { AstdCat, AisProperties } from '../interfaces';

export function addAisLayer<P extends AisProperties = AisProperties>({
  id,
  type,
  ngwMap,
  resource,
  dataFilter,
  styleFilter,
}: {
  id: string;
  ngwMap: NgwMap;
  resource: number;
  type: VectorAdapterLayerType;
  dataFilter: PropertiesFilter<P>;
  styleFilter: PropertiesFilter<P>;
}): CancelablePromise<void> {
  return fetchNgwLayerFeatures<Point | LineString, P>({
    connector: ngwMap.connector,
    resourceId: resource,
    // fields: ['shipid', 'astd_cat', 'iceclass', 'sizegroup', 'fuelq'],
    filters: dataFilter,
    limit: 60000,
    cache: true,
  }).then((features) => {
    const astdCatList: AstdCat[] = [];
    const color: Expression = ['match', ['get', 'shipid']];
    const shipidList: string[] = [];
    for (const f of features) {
      let p: keyof typeof f.properties;
      for (p in f.properties) {
        if (f.properties[p] === null) {
          (f.properties as Record<any, any>)[p] = '';
        }
      }

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
    const data: FeatureCollection<Point | LineString, P> = {
      type: 'FeatureCollection',
      features,
    };

    let paint: Paint = {};
    let selectedPaint: Paint = {};
    if (type === 'point') {
      paint = {
        color,
        stroke: true,
        strokeColor: 'white',
        opacity: 1,
        radius: 4,
      };
      selectedPaint = { ...(paint as CirclePaint), radius: 7 };
    } else {
      paint = { color };
      selectedPaint = { ...(paint as PathPaint), weight: 3 };
    }

    ngwMap
      .addGeoJsonLayer({
        id,
        data,
        order: 10,
        paint,
        type,
        selectedPaint,
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
                elem.innerHTML = `${val} <span style="display: inline-block;
                                                      background-color: ${color};
                                                      width: 10px;
                                                      height: 10px;
                                                      border-radius: 50%;"></span>`;
                return elem;
              },
              date_begin: secondsToDateString,
              date_end: secondsToDateString,
            },
          }),
        },
      })
      .then(() => {
        ngwMap.propertiesFilter(id, styleFilter);
      });
  });
}
