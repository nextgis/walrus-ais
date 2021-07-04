import NgwMap from '@nextgis/ngw-leaflet';

import {
  CSSProperties,
  MutableRefObject,
  ReactNode,
  useEffect,
  useState,
  useRef,
} from 'react';

import type { NgwMapOptions } from '@nextgis/ngw-map';
import connector from '../servises/connector';

export interface MapContainerProps extends NgwMapOptions {
  children?: ReactNode;
  className?: string;
  id?: string;
  placeholder?: ReactNode;
  style?: CSSProperties;
  whenCreated?: (map: NgwMap) => void;
}

export function useMapElement(
  mapRef: MutableRefObject<HTMLElement | null>,
  props: MapContainerProps,
): NgwMap | null {
  const [map, setMap] = useState<NgwMap | null>(null);

  useEffect(() => {
    if (mapRef.current !== null && map === null) {
      const ngwMap = new NgwMap({
        target: mapRef.current,
        connector,
        ...props,
      });
      if (props.center !== null && props.zoom !== null) {
        ngwMap.setView(props.center, props.zoom);
      }
      setMap(ngwMap);
    }
  }, [mapRef, map, props]);

  return map;
}

export function MapContainer<
  Props extends MapContainerProps = MapContainerProps,
>({ className, id, style, whenCreated, ...options }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const map = useMapElement(mapRef, options);

  const createdRef = useRef<boolean>(false);
  useEffect(() => {
    if (whenCreated && map !== null && createdRef.current === false) {
      createdRef.current = true;
      map.onLoad().then(() => {
        whenCreated(map);
      });
    }
    return () => {
      map && map.destroy();
    };
  }, [map, [whenCreated]]);

  const [props] = useState({ className, id, style });

  return <div id="map" {...props} ref={mapRef}></div>;
}
