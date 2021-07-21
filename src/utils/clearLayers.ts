import { AIS_LAYER_ID, WALRUS_LAYER_ID } from '../constants';
import type { VectorLayerAdapter } from '@nextgis/webmap';
import type { NgwMap } from '@nextgis/ngw-map';

export function clearLayers(ngwMap: NgwMap) {
  // FIXME: clean popup on mapbox layer remove
  [AIS_LAYER_ID, WALRUS_LAYER_ID].forEach((x) => {
    const l = ngwMap.getLayer(x) as VectorLayerAdapter;
    if (l && l.unselect) {
      l.unselect();
    }
    ngwMap.removeLayer(x);
  });
}

export function closePopups(ngwMap: NgwMap) {
  [AIS_LAYER_ID, WALRUS_LAYER_ID].forEach((x) => {
    const l = ngwMap.getLayer(x) as VectorLayerAdapter;
    if (l && l.unselect) {
      l.unselect();
    }
  });
}
