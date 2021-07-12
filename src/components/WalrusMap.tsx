import { useEffect, useState } from 'react';
import { groupResource } from '../config';
import { MapContainer } from '../NgwMap/Map';
import connector from '../services/connector';
import { parseDateFromResourceName } from '../utils/parseDateFromResourceName';
import { LogoutMapBtnControl } from './LogoutMapBtnControl';
import { PanelMapControl } from './PanelMapControl';

import type { NgwMap } from '@nextgis/ngw-map';
import type { AisLayerItem, DateDict } from '../interfaces';

interface WalrusMapProps {
  onLogout: () => void;
}

export function WalrusMap<Props extends WalrusMapProps = WalrusMapProps>(
  props: Props,
) {
  const [aisLayerItems, setAisLayerItems] = useState<AisLayerItem[]>([]);
  const [acitveAisLayerItem, setAcitveAisLayerItem] =
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
        items.sort((a, b) => (dateStr(b) > dateStr(a) ? -1 : 1));
        setAcitveAisLayerItem(items[0]);
        setAisLayerItems(items);
      });
    return () => {
      request.cancel();
    };
  }, []);

  useEffect(() => {
    if (ngwMap && acitveAisLayerItem) {
      ngwMap.removeLayer('ais-layer');
      console.log(1234);
      ngwMap.addNgwLayer({
        id: 'ais-layer',
        resource: acitveAisLayerItem.resource,
        fit: true,
        adapter: 'IMAGE',
      });
    }
  }, [acitveAisLayerItem, ngwMap]);

  const setupMapLayers = (ngwMap: NgwMap) => {
    setNgwMap(ngwMap);
  };

  return (
    <MapContainer
      id="map"
      qmsId={448}
      center={[104, 52]}
      zoom={3}
      whenCreated={setupMapLayers}
    >
      <LogoutMapBtnControl onClick={logout} />
      <PanelMapControl
        aisLayerItems={aisLayerItems}
        acitveAisLayerItem={acitveAisLayerItem}
        onChange={setAcitveAisLayerItem}
      />
    </MapContainer>
  );
}
