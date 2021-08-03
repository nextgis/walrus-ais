import WalrusOnIcon from '../images/walrus-logo-detail.svg';
import './WalrusLayerToggleMapControl.scss';

import { createControlComponent } from '../NgwMap/generic';

import type { ToggleControlOptions, ControlPosition } from '@nextgis/webmap';

export const WalrusLayerToggleMapControl = createControlComponent<
  any,
  ToggleControlOptions & { position?: ControlPosition }
>(function createWalrusLayerToggleMapControl(props, context) {
  return context.ngwMap.createToggleControl({
    onClick: props.onClick,
    html: {
      on: `<img src="${WalrusOnIcon}" width="19" height="19" alt="Скрыть треки" class="walrus-toggle-icon on">`,
      off: `<img src="${WalrusOnIcon}" width="19" height="19" alt="Показать треки" class="walrus-toggle-icon off">`,
    },
    title: {
      on: 'Скрыть треки',
      off: 'Показать треки',
    },
    ...props,
  });
});
