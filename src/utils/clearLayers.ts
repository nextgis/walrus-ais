import {
  AIS_LAYER_ID,
  WALRUS_LAYER_ID,
  AIS_TRACK_LAYER_ID,
} from '../constants';
import type { VectorLayerAdapter } from '@nextgis/webmap';
import type { NgwMap } from '@nextgis/ngw-map';

export function clearLayers(
  ngwMap: NgwMap,
  layers: string[] = [AIS_LAYER_ID, WALRUS_LAYER_ID, AIS_TRACK_LAYER_ID],
) {
  // FIXME: clean popup on mapbox layer remove
  layers.forEach((x) => {
    const l = ngwMap.getLayer(x) as VectorLayerAdapter;
    if (l && l.unselect) {
      l.unselect();
    }
    ngwMap.removeLayer(x);
  });
}

export function closePopups(
  ngwMap: NgwMap,
  layers: string[] = [AIS_LAYER_ID, WALRUS_LAYER_ID, AIS_TRACK_LAYER_ID],
) {
  layers.forEach((x) => {
    const l = ngwMap.getLayer(x) as VectorLayerAdapter;
    if (l && l.unselect) {
      l.unselect();
    }
  });
}
