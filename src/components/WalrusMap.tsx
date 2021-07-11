import { useEffect, useState } from 'react';
import { groupResource } from '../config';
import { MapContainer } from '../NgwMap/Map';
import connector from '../services/connector';
import { LogoutMapBtnControl } from './LogoutMapBtnControl';

import type { NgwMap } from '@nextgis/ngw-map';
import type { ResourceItem } from '@nextgis/ngw-connector';

interface WalrusMapProps {
  onLogout: () => void;
}

export function WalrusMap<Props extends WalrusMapProps = WalrusMapProps>(
  props: Props,
) {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [ngwMap, setNgwMap] = useState<NgwMap | null>(null);
  const logout = () => props.onLogout();
  useEffect(() => {
    const request = connector
      .getResourceChildren(groupResource)
      .then((data) => {
        const astdAreaLayers = data.filter(
          (x) =>
            x.resource.cls === 'vector_layer' &&
            x.resource.display_name.startsWith('ASTD_area_level'),
        );
        setResources(astdAreaLayers);
      });
    return () => {
      request.cancel();
    };
  }, []);

  useEffect(() => {
    const resource = resources[0];
    if (ngwMap && resource) {
      console.log(resource);
      ngwMap.addNgwLayer({
        resource: resource.resource.id,
        fit: true,
        // adapter: 'IMAGE',
      });
    }
  }, [resources, ngwMap]);

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
    </MapContainer>
  );
}
