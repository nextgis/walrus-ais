import PointsIcon from '../images/show_points.svg';
import PointsTracksIcon from '../images/show_points_and_tracks.svg';

import { createControlComponent } from '../NgwMap/generic';

import type { ToggleControlOptions, ControlPosition } from '@nextgis/webmap';

export const AisLayersToggleMapControl = createControlComponent<
  any,
  ToggleControlOptions & { position?: ControlPosition }
>(function createAisLayerToggleMapControl(props, context) {
  return context.ngwMap.createToggleControl({
    onClick: props.onClick,
    html: {
      on: `<img src="${PointsTracksIcon}" width="64" height="64" alt="Скрыть треки">`,
      off: `<img src="${PointsIcon}" width="64" height="64" alt="Показать треки">`,
    },
    title: {
      on: 'Скрыть треки',
      off: 'Показать треки',
    },
    ...props,
  });
});
