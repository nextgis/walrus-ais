import { Container, Hero } from 'react-bulma-components';
import { MapControl } from '../NgwMap/MapControl';
import { DateFilter } from './DateFilter';
import { AstdCatSelect } from './AstdCatSelect';

import type { FunctionComponent } from 'react';
import type { AisLayerItem, WalrusMapFilter } from '../interfaces';

interface PanelMapControlProps {
  aisLayerItems: AisLayerItem[];
  activeAisLayerItem: AisLayerItem | null;

  astdCatList: string[];
  activeAstdCat: string;

  onFilterChange: (filter: Partial<WalrusMapFilter>) => void;
}

export const PanelMapControl: FunctionComponent<PanelMapControlProps> = (
  props,
) => {
  const { activeAisLayerItem, aisLayerItems, activeAstdCat, astdCatList } =
    props;
  return (
    <MapControl position="bottom-left" bar>
      <Hero size="small" color="primary">
        <Hero.Body>
          <Container></Container>
          {props.aisLayerItems.length ? (
            <>
              <DateFilter
                {...{ activeAisLayerItem, aisLayerItems }}
                onChange={(date) => props.onFilterChange({ date })}
              ></DateFilter>
              {/* <AstdCatSelect
                {...{ activeAstdCat, astdCatList }}
                onChange={(astdCat) => props.onFilterChange({ astdCat })}
              ></AstdCatSelect> */}
            </>
          ) : (
            <p className="is-size-6">Загрузка списка слоёв...</p>
          )}
        </Hero.Body>
      </Hero>
    </MapControl>
  );
};
