import { useEffect, useState, useRef, useMemo, useCallback } from 'react';

import Progress from '@nextgis/progress';
import { objectDeepEqual } from '@nextgis/utils';
import {
  fuelQList,
  astdCatList,
  iceClassList,
  AIS_LAYER_ID,
  sizeGroupList,
  AIS_DEF_FILTER_DATA,
} from '../constants';
import { MapContainer } from '../NgwMap/Map';
import { clearLayers, closePopups } from '../utils/clearLayers';
import { addAisLayer } from '../utils/addAisLayer';
import { generateFilter } from '../utils/generateFilter';
import { fetchAisFeatures } from '../utils/fetchAisFeatures';
import { createAisCalendar } from '../utils/createAisCalendar';
import { findAisLayerByDate } from '../utils/findAisLayerByDate';
import { addWalrusLayer } from '../utils/addWalrusLayer';
import { LogoutMapBtnControl } from './LogoutMapBtnControl';
import { PanelMapControl } from './PanelMapControl';
import { MapLoadingControl } from './MapLoadingControl';

import type { NgwMap } from '@nextgis/ngw-map';
import type CancelablePromise from '@nextgis/cancelable-promise';
import type {
  AisCalendar,
  AisFilterInterface,
  AisLayerItem,
  DateDict,
} from '../interfaces';

interface WalrusMapProps {
  onLogout: () => void;
}

export function WalrusMap<Props extends WalrusMapProps = WalrusMapProps>(
  props: Props,
) {
  const [ngwMap, setNgwMap] = useState<NgwMap | null>(null);
  const [aisLayerLoading, setAisLayerLoading] = useState(false);
  const [aisLayerItems, setAisLayerItems] = useState<AisLayerItem[]>([]);
  const [activeDate, setActiveDate] = useState<DateDict | null>(null);
  const calendar: AisCalendar = useMemo(
    () => createAisCalendar(aisLayerItems),
    [aisLayerItems],
  );
  const [aisFilter, setAisFilter] = useState<AisFilterInterface>({
    astd_cat: astdCatList,
    iceclass: iceClassList,
    sizegroup: sizeGroupList,
    fuelq: fuelQList,
  });
  const aisFilterData = AIS_DEF_FILTER_DATA;
  const progress = useRef(new Progress());
  const setupProgress = useCallback(() => {
    progress.current.emitter.on('start', () => {
      setAisLayerLoading(true);
    });
    progress.current.emitter.on('stop', () => {
      setAisLayerLoading(false);
    });
  }, [progress]);
  // load layers list on mount to fill calendar
  useEffect(() => {
    setupProgress();
    progress.current.addLoading();
    const request = fetchAisFeatures()
      .then((items) => {
        progress.current.addLoaded();
        const { year, month } = items[0];
        setAisLayerItems(items);
        setActiveDate({ year, month });
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
    const req: CancelablePromise<void>[] = [];
    if (ngwMap) {
      clearLayers(ngwMap);
      if (activeDate) {
        const activeAisLayerItem = findAisLayerByDate(
          aisLayerItems,
          activeDate,
        );
        if (activeAisLayerItem) {
          progress.current.addLoading();
          req.push(
            addAisLayer({
              ngwMap,
              resource: activeAisLayerItem.resource,
              filter: generateFilter(aisFilter),
            }),
          );
        }
        progress.current.addLoading();
        req.push(
          addWalrusLayer({
            ngwMap,
            date: activeDate,
          }),
        );
        for (const r of req) {
          r.then(() => {
            progress.current.addLoaded();
          }).catch(() => {
            progress.current.addLoaded();
          });
        }
      }
    }
    return () => {
      req.forEach((x) => x.cancel());
    };
  }, [activeDate]);

  const onDateChange = useCallback(
    (date: DateDict | null) => {
      if (date && date.year && date.month) {
        if (!objectDeepEqual(activeDate || {}, date)) {
          setActiveDate(date);
        }
      }
    },
    [activeDate],
  );
  const onFilterChange = useCallback(
    (filter: Partial<AisFilterInterface>) => {
      ngwMap && closePopups(ngwMap);
      setAisFilter((prevState) => ({ ...prevState, ...filter }));
    },
    [ngwMap],
  );

  return (
    <MapContainer
      id="map"
      // qmsId={448}
      osm
      bounds={[41.3607, 67.9801, 66.5899, 70.6804]}
      whenCreated={setNgwMap}
    >
      <LogoutMapBtnControl onClick={props.onLogout} />
      <PanelMapControl
        {...{
          calendar,
          activeDate,
          aisLayerItems,
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
