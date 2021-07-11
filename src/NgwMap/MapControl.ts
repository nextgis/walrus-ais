import { ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useNgwMapContext } from './context';

import type { ControlOptions, CreateControlOptions } from '@nextgis/webmap';

interface MapControlProps extends CreateControlOptions, ControlOptions {
  children?: ReactNode;
}

export function MapControl<P extends MapControlProps = MapControlProps>(
  props: P,
) {
  const { bar, margin, addClass } = props;

  const context = useNgwMapContext();

  const portal = document.createElement('div');

  function createInstance() {
    return context.ngwMap.createControl(
      {
        onAdd() {
          const el = document.createElement('div');
          el.appendChild(portal);
          return el;
        },

        onRemove() {
          // ignore
        },
      },
      { bar, margin, addClass },
    );
  }
  const instance = createInstance();
  const position = props.position || 'top-left';

  useEffect(
    function addControl() {
      context.ngwMap.addControl(instance, position);

      return function removeControl() {
        context.ngwMap.removeControl(instance);
      };
    },
    [context.ngwMap, instance],
  );

  return createPortal(props.children, portal);
}
