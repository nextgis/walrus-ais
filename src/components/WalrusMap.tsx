import { useEffect, useState, useRef } from 'react';

import Progress from '@nextgis/progress';
import {
  AIS_DEF_FILTER_DATA,
  AIS_LAYER_ID,
  NULL_STR,
  fuelQList,
  astdCatList,
  iceClassList,
  sizeGroupList,
} from '../constants';
import { MapContainer } from '../NgwMap/Map';
import { addAisLayer } from '../utils/addAisLayer';
import { generateFilter } from '../utils/generateFilter';
import { fetchAisFeatures } from '../utils/fetchAisFeatures';
import { LogoutMapBtnControl } from './LogoutMapBtnControl';
import { PanelMapControl } from './PanelMapControl';
import { MapLoadingControl } from './MapLoadingControl';

import type { NgwMap } from '@nextgis/ngw-map';
import type CancelablePromise from '@nextgis/cancelable-promise';
import type { AisFilterInterface, AisLayerItem, DateDict } from '../interfaces';

interface WalrusMapProps {
  onLogout: () => void;
}

export function WalrusMap<Props extends WalrusMapProps = WalrusMapProps>(
  props: Props,
) {
  const [ngwMap, setNgwMap] = useState<NgwMap | null>(null);
  const [aisLayerLoading, setAisLayerLoading] = useState(false);
  const [aisLayerItems, setAisLayerItems] = useState<AisLayerItem[]>([]);
  const [activeAisLayerItem, setActiveAisLayerItem] =
    useState<AisLayerItem | null>(null);

  const [aisFilter, setAisFilter] = useState<AisFilterInterface>({
    astd_cat: astdCatList,
    iceclass: iceClassList,
    sizegroup: sizeGroupList,
    fuelq: fuelQList,
  });
  const aisFilterData = AIS_DEF_FILTER_DATA;
  const progress = useRef(new Progress());
  const setupProgress = () => {
    progress.current.emitter.on('start', () => {
      setAisLayerLoading(true);
    });
    progress.current.emitter.on('stop', () => {
      setAisLayerLoading(false);
    });
  };
  // load layers list on mount to fill calendar
  useEffect(() => {
    setupProgress();
    progress.current.addLoading();
    const request = fetchAisFeatures()
      .then((items) => {
        progress.current.addLoaded();
        setActiveAisLayerItem(items[0]);
        setAisLayerItems(items);
      })
      .catch(() => {
        progress.current.addLoaded();
      });

    return () => {
      request.cancel();
      progress.current.emitter.removeAllListeners();
    };
  }, []);

  // set filter for current ais layer
  useEffect(() => {
    if (ngwMap && ngwMap.getLayer(AIS_LAYER_ID)) {
      ngwMap.propertiesFilter(AIS_LAYER_ID, generateFilter(aisFilter));
    }
  }, [aisFilter]);

  // add a layer on the map when calendar changes
  useEffect(() => {
    let req: CancelablePromise<void>;
    if (ngwMap) {
      ngwMap.removeLayer(AIS_LAYER_ID);
      if (activeAisLayerItem) {
        progress.current.addLoading();
        req = addAisLayer({
          ngwMap,
          resource: activeAisLayerItem.resource,
          filter: generateFilter(aisFilter),
        })
          .then(() => {
            progress.current.addLoaded();
          })
          .catch(() => {
            progress.current.addLoaded();
          });
      }
    }
    return () => {
      req && req.cancel();
    };
  }, [activeAisLayerItem]);

  const onDateChange = (date: DateDict | null) => {
    if (date) {
      const { year, month } = date;
      if ([year, month].every((x) => x && x !== NULL_STR)) {
        const exist = aisLayerItems.find(
          (x) => x.year === year && x.month === month,
        );
        if (exist && ngwMap) {
          return setActiveAisLayerItem(exist);
        }
      }
    }
    setActiveAisLayerItem(null);
  };
  const onFilterChange = (filter: Partial<AisFilterInterface>) => {
    setAisFilter((prevState) => ({ ...prevState, ...filter }));
  };

  return (
    <MapContainer
      id="map"
      qmsId={448}
      bounds={[41.3607, 67.9801, 66.5899, 70.6804]}
      whenCreated={setNgwMap}
    >
      <LogoutMapBtnControl onClick={props.onLogout} />
      <PanelMapControl
        {...{
          aisLayerItems,
          activeAisLayerItem,
          aisFilter,
          aisFilterData,
          onFilterChange,
          onDateChange,
        }}
      />
      <MapLoadingControl loading={aisLayerLoading} />
    </MapContainer>
  );
}
