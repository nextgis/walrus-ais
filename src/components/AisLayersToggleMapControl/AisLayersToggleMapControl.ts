import { createControlComponent } from '../../NgwMap/generic';
import { AisLayerToggle } from './AisLayersToggle';

import type { ControlPosition } from '@nextgis/webmap';
import type { AisLayersToggleMapControlOptions } from './interfaces';

export const AisLayersToggleMapControl = createControlComponent<
  any,
  AisLayersToggleMapControlOptions & { position?: ControlPosition }
>(function createAisLayerToggleMapControl(props, context) {
  return context.ngwMap.createControl(new AisLayerToggle(props), {
    bar: true,
    margin: true,
    addClass: 'mapboxgl-ctrl-group',
  });
});
