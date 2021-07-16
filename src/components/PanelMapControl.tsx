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
  AisCalendar,
} from '../interfaces';

interface PanelMapControlProps {
  calendar: AisCalendar;
  activeDate: DateDict | null;

  aisLayerItems: AisLayerItem[];

  aisFilter: AisFilterInterface;
  aisFilterData: AisFilterData;

  onFilterChange: (filter: Partial<AisFilterInterface>) => void;
  onDateChange: (date: DateDict | null) => void;
}

export const PanelMapControl: FunctionComponent<PanelMapControlProps> = (
  props,
) => {
  const { calendar, activeDate, aisFilterData, aisFilter } = props;
  return (
    <MapControl position="bottom-left" bar>
      <Hero size="small" color="primary">
        <Hero.Body>
          <Container></Container>
          {props.aisLayerItems.length ? (
            <>
              <DateFilter
                {...{ calendar, activeDate }}
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
