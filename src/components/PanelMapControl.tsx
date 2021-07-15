import { Container, Hero } from 'react-bulma-components';
import { MapControl } from '../NgwMap/MapControl';
import { DateFilter } from './DateFilter';
import { AisFilter } from './AisFilter';

import type { FunctionComponent } from 'react';
import type {
  AisFilterData,
  AisLayerItem,
  DateDict,
  AisFilterInterface,
} from '../interfaces';

interface PanelMapControlProps {
  aisLayerItems: AisLayerItem[];
  activeAisLayerItem: AisLayerItem | null;

  aisFilter: AisFilterInterface;
  aisFilterData: AisFilterData;

  onFilterChange: (filter: Partial<AisFilterInterface>) => void;
  onDateChange: (date: DateDict | null) => void;
}

export const PanelMapControl: FunctionComponent<PanelMapControlProps> = (
  props,
) => {
  const { activeAisLayerItem, aisLayerItems, aisFilterData, aisFilter } = props;
  return (
    <MapControl position="bottom-left" bar>
      <Hero size="small" color="primary">
        <Hero.Body>
          <Container></Container>
          {props.aisLayerItems.length ? (
            <>
              <DateFilter
                {...{ activeAisLayerItem, aisLayerItems }}
                onChange={(date) => props.onDateChange(date)}
              ></DateFilter>
              <AisFilter
                {...{ aisFilterData, aisFilter }}
                onChange={(filter) => props.onFilterChange(filter)}
              ></AisFilter>
            </>
          ) : (
            <p className="is-size-6">Загрузка списка слоёв...</p>
          )}
        </Hero.Body>
      </Hero>
    </MapControl>
  );
};
