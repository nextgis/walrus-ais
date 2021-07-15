import { fetchNgwLayerFeatures } from '@nextgis/ngw-kit';
import { getRandomColor } from '../utils/getRandomColor';

import type { FeatureCollection, Point } from 'geojson';
import type { NgwMap } from '@nextgis/ngw-map';
import type { Expression } from '@nextgis/paint';
import type CancelablePromise from '@nextgis/cancelable-promise';
import type { AisProperties, AstdCat } from '../interfaces';

export function addAisLayer(
  ngwMap_: NgwMap,
  resource: number,
): CancelablePromise<void> {
  return fetchNgwLayerFeatures<Point, AisProperties>({
    connector: ngwMap_.connector,
    resourceId: resource,
    fields: ['shipid', 'astd_cat'],
    limit: 52000,
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
        color.push(getRandomColor());
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
    ngwMap_.addGeoJsonLayer({
      id: 'ais-layer',
      data,
      paint: {
        color,
        stroke: true,
        strokeColor: 'white',
        opacity: 1,
        radius: 4,
      },
    });
  });
}
