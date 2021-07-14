import { useEffect, useState } from 'react';
import { groupResource } from '../config';
import { MapContainer } from '../NgwMap/Map';
import connector from '../services/connector';
import { parseDateFromResourceName } from '../utils/parseDateFromResourceName';
import { LogoutMapBtnControl } from './LogoutMapBtnControl';
import { PanelMapControl } from './PanelMapControl';

import type { NgwMap } from '@nextgis/ngw-map';
import type { AisLayerItem, DateDict } from '../interfaces';
import { MapLoadingControl } from './MapLoadingControl';

interface WalrusMapProps {
  onLogout: () => void;
}

export function WalrusMap<Props extends WalrusMapProps = WalrusMapProps>(
  props: Props,
) {
  const [aisLayerLoading, setAisLayerLoading] = useState(false);
  const [aisLayerItems, setAisLayerItems] = useState<AisLayerItem[]>([]);
  const [activeAisLayerItem, setActiveAisLayerItem] =
    useState<AisLayerItem | null>(null);
  const [ngwMap, setNgwMap] = useState<NgwMap | null>(null);
  const logout = () => props.onLogout();
  const dateStr = (dt: DateDict) => '' + dt.year + dt.month;
  useEffect(() => {
    const request = connector
      .getResourceChildren(groupResource)
      .then((data) => {
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
        setActiveAisLayerItem(items[0]);
        setAisLayerItems(items);
      });
    return () => {
      request.cancel();
    };
  }, []);

  useEffect(() => {
    if (ngwMap && activeAisLayerItem) {
      ngwMap.removeLayer('ais-layer');
      setAisLayerLoading(true);
      ngwMap
        .addNgwLayer({
          id: 'ais-layer',
          resource: activeAisLayerItem.resource,
          adapterOptions: {
            waitFullLoad: true,
            paint: {
              color: 'blue',
              stroke: true,
              strokeColor: 'white',
              opacity: 1,
              radius: 4,
            },
          },
          // adapter: 'IMAGE',
        })
        .finally(() => {
          setAisLayerLoading(false);
        });
    }
  }, [activeAisLayerItem, ngwMap]);

  const setupMapLayers = (ngwMap: NgwMap) => {
    setNgwMap(ngwMap);
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
        aisLayerItems={aisLayerItems}
        acitveAisLayerItem={activeAisLayerItem}
        onChange={setActiveAisLayerItem}
      />
      <MapLoadingControl loading={aisLayerLoading} />
    </MapContainer>
  );
}
