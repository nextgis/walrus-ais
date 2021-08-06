import Iconify from '@iconify/iconify';
import logOut from '@iconify/icons-mdi/log-out';

Iconify.addIcon('mdi:log-out', logOut);

import { createControlComponent } from '../NgwMap/generic';
import type { ButtonControlOptions, ControlOptions } from '@nextgis/webmap';

export type LogoutMapBtnControlProps = ButtonControlOptions & ControlOptions;

export const LogoutMapBtnControl = createControlComponent<
  any,
  LogoutMapBtnControlProps
>(function createLogoutMapControl(props, context) {
  return context.ngwMap.createButtonControl({
    onClick: props.onClick,
    html: '<span class="iconify map-btn-icon" data-icon="mdi:log-out"></span>',
  });
});
