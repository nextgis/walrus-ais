import { Container, Hero } from 'react-bulma-components';
import { MapControl } from '../NgwMap/MapControl';
import { DateFilter } from './DateFilter';

import type { FunctionComponent } from 'react';
import type { AisLayerItem, WalrusMapFilter } from '../interfaces';

interface PanelMapControlProps {
  aisLayerItems: AisLayerItem[];
  activeAisLayerItem: AisLayerItem | null;
  onFilterChange: (filter: WalrusMapFilter) => void;
}

export const PanelMapControl: FunctionComponent<PanelMapControlProps> = (
  props,
) => {
  return (
    <MapControl position="bottom-left" bar>
      <Hero size="small" color="primary">
        <Hero.Body>
          <Container></Container>
          {props.aisLayerItems.length ? (
            <DateFilter
              {...props}
              onChange={(date) => props.onFilterChange({ date })}
            ></DateFilter>
          ) : (
            'Загрузка списка слоёв...'
          )}
        </Hero.Body>
      </Hero>
    </MapControl>
  );
};
