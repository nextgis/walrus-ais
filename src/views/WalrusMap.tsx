import { useEffect, useState, useRef, useMemo, useCallback } from 'react';

import Progress from '@nextgis/progress';
import { objectDeepEqual } from '@nextgis/utils';
import {
  AIS_LAYER_ID,
  AIS_DEF_FILTER_DATA,
  AIS_TRACK_LAYER_ID,
} from '../constants';
import { MapContainer } from '../NgwMap/Map';
import { clearLayers, closePopups } from '../utils/clearLayers';
import { addAisLayer } from '../utils/addAisLayer';
import { addWalrusLayer } from '../utils/addWalrusLayer';
import { generateFilter } from '../utils/generateFilter';
import { fetchAisFeatures } from '../utils/fetchAisFeatures';
import { createAisCalendar } from '../utils/createAisCalendar';
import { findAisLayerByDate } from '../utils/findAisLayerByDate';
import { PanelMapControl } from '../components/PanelMapControl';
import { MapLoadingControl } from '../components/MapLoadingControl';
import { LogoutMapBtnControl } from '../components/LogoutMapBtnControl';

import type { NgwMap } from '@nextgis/ngw-map';
import type CancelablePromise from '@nextgis/cancelable-promise';
import type {
  AisFilterInterface,
  AisPointProperties,
  AisTrackProperties,
  AisCalendar,
  AisLayerItem,
  DateDict,
  AisVisibility,
} from '../interfaces';
import { aisTrackResource } from '../config';
import { generateAisTrackFilter } from '../utils/generateAisTrackFilter';
import { AisLayersToggleMapControl } from '../components/AisLayersToggleMapControl/AisLayersToggleMapControl';

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
  const [trackLayerVisibility, setTrackLayerVisibility] = useState(true);
  const [pointLayerVisibility, setPointLayerVisibility] = useState(true);
  const calendar: AisCalendar = useMemo(
    () => createAisCalendar(aisLayerItems),
    [aisLayerItems],
  );
  const [aisFilter, setAisFilter] =
    useState<AisFilterInterface>(AIS_DEF_FILTER_DATA);
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
    const filter = generateFilter(aisFilter);
    [AIS_LAYER_ID, AIS_TRACK_LAYER_ID].forEach((x) => {
      if (ngwMap) {
        ngwMap.propertiesFilter(x, filter);
      }
    });
  }, [aisFilter]);

  // add a layer on the map when calendar changes
  useEffect(() => {
    const req: CancelablePromise<void>[] = [];
    if (ngwMap) {
      if (activeDate) {
        const activeAisLayerItem = findAisLayerByDate(
          aisLayerItems,
          activeDate,
        );
        const styleFilter = generateFilter(aisFilter);
        if (
          activeAisLayerItem &&
          pointLayerVisibility &&
          !ngwMap.getLayer(AIS_LAYER_ID)
        ) {
          progress.current.addLoading();
          req.push(
            addAisLayer<AisPointProperties>({
              id: AIS_LAYER_ID,
              ngwMap,
              type: 'point',
              visibility: pointLayerVisibility,
              resource: activeAisLayerItem.resource,
              dataFilter: [], // generateFilter(AIS_DEF_FILTER_DATA),
              styleFilter,
            }),
          );
        }
        if (trackLayerVisibility && !ngwMap.getLayer(AIS_TRACK_LAYER_ID)) {
          progress.current.addLoading();
          req.push(
            addAisLayer<AisTrackProperties>({
              id: AIS_TRACK_LAYER_ID,
              ngwMap,
              type: 'line',
              visibility: trackLayerVisibility,
              resource: aisTrackResource,
              dataFilter: generateAisTrackFilter(activeDate),
              styleFilter,
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
  }, [activeDate, trackLayerVisibility, pointLayerVisibility]);

  const onDateChange = useCallback(
    (date: DateDict | null) => {
      ngwMap && clearLayers(ngwMap);
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

  useEffect(() => {
    if (ngwMap) {
      ngwMap.toggleLayer(AIS_TRACK_LAYER_ID, trackLayerVisibility);
      ngwMap.toggleLayer(AIS_LAYER_ID, pointLayerVisibility);
    }
  }, [trackLayerVisibility, pointLayerVisibility, ngwMap]);

  const toggleAisLayer = ({ point, track }: AisVisibility) => {
    setTrackLayerVisibility(!!track);
    setPointLayerVisibility(!!point);
  };

  return (
    <MapContainer
      id="map"
      // qmsId={448}
      osm
      bounds={[41.3607, 67.9801, 66.5899, 70.6804]}
      whenCreated={setNgwMap}
    >
      <LogoutMapBtnControl onClick={props.onLogout} />
      <AisLayersToggleMapControl
        position="top-right"
        onClick={toggleAisLayer}
        track={trackLayerVisibility}
        point={pointLayerVisibility}
      />
      <PanelMapControl
        {...{
          onDateChange,
          activeDate,
          calendar,
          aisFilter,
          aisLayerItems,
          aisFilterData,
          onFilterChange,
        }}
      />
      <MapLoadingControl loading={aisLayerLoading} />
    </MapContainer>
  );
}
