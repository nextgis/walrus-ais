// import NgwMap from '@nextgis/ngw-leaflet';
// import NgwMap from '@nextgis/ngw-ol';
import NgwMap from '@nextgis/ngw-mapbox';

import {
  CSSProperties,
  MutableRefObject,
  ReactNode,
  useEffect,
  useState,
  useRef,
  useMemo,
} from 'react';

import connector from '../services/connector';
import { CONTEXT_VERSION, NgwMapProvider } from './context';

import type { NgwMapOptions } from '@nextgis/ngw-map';

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
  const [ngwMap, setNgwMap] = useState<NgwMap | null>(null);

  useEffect(() => {
    if (mapRef.current !== null && ngwMap === null) {
      const ngwMap = new NgwMap({
        target: mapRef.current,
        connector,
        ...props,
      });
      if (props.center !== null && props.zoom !== null) {
        ngwMap.setView(props.center, props.zoom);
      }
      setNgwMap(ngwMap);
    }
  }, [mapRef, ngwMap, props]);

  return ngwMap;
}

export function MapContainer<
  Props extends MapContainerProps = MapContainerProps,
>({
  whenCreated,
  placeholder,
  className,
  children,
  style,
  id,
  ...options
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const ngwMap = useMapElement(mapRef, options);

  const createdRef = useRef<boolean>(false);
  useEffect(() => {
    if (whenCreated && ngwMap !== null && createdRef.current === false) {
      createdRef.current = true;
      ngwMap.onLoad().then(() => {
        whenCreated(ngwMap);
      });
    }
  }, [ngwMap, [whenCreated]]);

  // on unmount
  useEffect(() => {
    return () => {
      if (ngwMap) {
        ngwMap.destroy();
      }
    };
  }, []);

  const [props] = useState({ className, id, style });
  const context = useMemo(
    () => (ngwMap ? { __version: CONTEXT_VERSION, ngwMap } : null),
    [ngwMap],
  );

  const contents = context ? (
    <NgwMapProvider value={context}>{children}</NgwMapProvider>
  ) : (
    placeholder ?? null
  );
  const p = { ...props };
  if (!p.id) {
    p.id = 'map';
  }
  return (
    <div {...p} ref={mapRef}>
      {contents}
    </div>
  );
}
