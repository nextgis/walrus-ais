import { useEffect, useState } from 'react';
import { fetchNgwLayerFeatures } from '@nextgis/ngw-kit';
import Progress from '@nextgis/progress';
import { groupResource } from '../config';
import { NULL_STR } from '../constants';
import { MapContainer } from '../NgwMap/Map';
import connector from '../services/connector';
import { parseDateFromResourceName } from '../utils/parseDateFromResourceName';
import { LogoutMapBtnControl } from './LogoutMapBtnControl';
import { PanelMapControl } from './PanelMapControl';

import type { FeatureCollection, Point } from 'geojson';
import type { NgwMap } from '@nextgis/ngw-map';
import type { Expression } from '@nextgis/paint';
import type CancelablePromise from '@nextgis/cancelable-promise';
import type {
  AisFilterData,
  AisLayerItem,
  AisProperties,
  AstdCat,
  DateDict,
  WalrusMapFilter,
} from '../interfaces';
import { MapLoadingControl } from './MapLoadingControl';
import { getRandomColor } from '../utils/getRandomColor';
import { useRef } from 'react';

interface WalrusMapProps {
  onLogout: () => void;
}

const dateStr = (dt: DateDict) => '' + dt.year + dt.month;

export function WalrusMap<Props extends WalrusMapProps = WalrusMapProps>(
  props: Props,
) {
  const [ngwMap, setNgwMap] = useState<NgwMap | null>(null);

  const [aisLayerLoading, setAisLayerLoading] = useState(false);
  const [aisLayerItems, setAisLayerItems] = useState<AisLayerItem[]>([]);
  const [activeAisLayerItem, setActiveAisLayerItem] =
    useState<AisLayerItem | null>(null);

  const [astdCatList, setAstdCatList] = useState<AstdCat[]>([]);
  const [activeAstdCat, setActiveAstdCat] = useState<AstdCat>('');

  const progress = useRef(new Progress());

  const setupProgress = () => {
    progress.current.emitter.on('start', () => {
      setAisLayerLoading(true);
    });
    progress.current.emitter.on('stop', () => {
      setAisLayerLoading(false);
    });
  };

  const logout = () => props.onLogout();
  useEffect(() => {
    const request = fetchAisLayers().then((items) => {
      setActiveAisLayerItem(items[0]);
      setAisLayerItems(items);
    });
    setupProgress();
    return () => {
      request.cancel();
      progress.current.emitter.removeAllListeners();
    };
  }, []);

  useEffect(() => {
    let req: CancelablePromise<void>;
    if (ngwMap) {
      ngwMap.removeLayer('ais-layer');
      if (activeAisLayerItem) {
        progress.current.addLoading();
        req = addAisLayer(ngwMap, activeAisLayerItem.resource)
          .then(({ astdCatList }) => {
            setAstdCatList(astdCatList);
            progress.current.addLoaded();
            if (!astdCatList.includes(activeAstdCat)) {
              setActiveAstdCat(astdCatList[0]);
            }
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

  const setupMapLayers = (ngwMap: NgwMap) => {
    setNgwMap(ngwMap);
  };

  const onFilterChangeChange = (filter: Partial<WalrusMapFilter>) => {
    if (filter.date) {
      const { year, month } = filter.date;
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

  return (
    <MapContainer
      id="map"
      qmsId={448}
      bounds={[41.3607, 67.9801, 66.5899, 70.6804]}
      whenCreated={setupMapLayers}
    >
      <LogoutMapBtnControl onClick={logout} />
      <PanelMapControl
        {...{ aisLayerItems, activeAisLayerItem, astdCatList, activeAstdCat }}
        onFilterChange={onFilterChangeChange}
      />
      <MapLoadingControl loading={aisLayerLoading} />
    </MapContainer>
  );
}

function addAisLayer(
  ngwMap_: NgwMap,
  resource: number,
): CancelablePromise<AisFilterData> {
  return fetchNgwLayerFeatures<Point, AisProperties>({
    connector: ngwMap_.connector,
    resourceId: resource,
    fields: ['shipid', 'astd_cat'],
    limit: 52000,
  }).then((features) => {
    const astdCatList: AstdCat[] = [];
    const color: Expression = ['match', ['get', 'shipid']];
    const shipidList: string[] = [];
    for (const f of features) {
      const shipid = f.properties['shipid'];
      const astdCat = f.properties['astd_cat'];
      if (!shipidList.includes(shipid)) {
        shipidList.push(shipid);
        color.push(shipid);
        color.push(getRandomColor());
      }
      if (!astdCatList.includes(astdCat)) {
        astdCatList.push(astdCat);
      }
    }
    // last item is default value
    color.push('gray');
    const data: FeatureCollection<Point, AisProperties> = {
      type: 'FeatureCollection',
      features,
    };
    ngwMap_.addGeoJsonLayer({
      id: 'ais-layer',
      data,
      paint: {
        color,
        stroke: true,
        strokeColor: 'white',
        opacity: 1,
        radius: 4,
      },
    });
    return { astdCatList };
  });
}

function fetchAisLayers() {
  return connector.getResourceChildren(groupResource).then((data) => {
    const items: AisLayerItem[] = [];
    for (const i of data) {
      const res = i.resource;
      if (
        res.cls === 'vector_layer' &&
        res.display_name.startsWith('ASTD_area_level')
      ) {
        items.push({
          resource: res.id,
          name: res.display_name,
          ...parseDateFromResourceName(res.display_name),
        });
      }
    }
    items.sort((a, b) => (dateStr(b) > dateStr(a) ? 1 : -1));
    return items;
  });
}
