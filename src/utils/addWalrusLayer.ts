import { fetchNgwLayerFeatures } from '@nextgis/ngw-kit';
import { getIcon } from '@nextgis/icons';
import { WALRUS_LAYER_ID } from '../constants';
import { walrusLayer } from '../config';
import { createPopupContent } from './createPopupContent';
import { getMonthDateRange } from './getMonthDateRange';

import type { FeatureCollection, Point } from 'geojson';
import type { NgwMap } from '@nextgis/ngw-map';
import type { PropertiesFilter } from '@nextgis/properties-filter';
import type CancelablePromise from '@nextgis/cancelable-promise';
import type { DateDict, WalrusProperties } from '../interfaces';

export function addWalrusLayer({
  ngwMap,
  date,
}: {
  ngwMap: NgwMap;
  date: DateDict;
  filter?: PropertiesFilter;
}): CancelablePromise<void> {
  const dateFilter: PropertiesFilter<WalrusProperties> = getMonthDateRange(
    date,
  ).map((x, i) => ['dt', i ? 'lt' : 'gt', x / 1000]);
  return fetchNgwLayerFeatures<Point, WalrusProperties>({
    connector: ngwMap.connector,
    resourceId: walrusLayer,
    // fields: ['dt'],
    filters: [dateFilter],
    limit: 60000,
    cache: true,
  }).then((features) => {
    const data: FeatureCollection<Point, WalrusProperties> = {
      type: 'FeatureCollection',
      features,
    };
    ngwMap.addGeoJsonLayer({
      id: WALRUS_LAYER_ID,
      data,
      order: 20,
      paint: getIcon({
        color: 'black',
        shape: 'marker',
        size: 14,
        stroke: 1,
        strokeColor: 'white',
      }),
      selectable: true,
      popupOnSelect: true,
      popupOptions: {
        createPopupContent: createPopupContent({ resource: walrusLayer }),
      },
    });
  });
}
