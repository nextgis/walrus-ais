import type { FunctionComponent } from 'react';
import { Progress } from 'react-bulma-components';

interface MapLoadingControl {
  loading: boolean;
}

export const MapLoadingControl: FunctionComponent<MapLoadingControl> = (
  props,
) => {
  return (
    <>
      {props.loading && (
        <div
          style={{
            position: 'absolute',
            zIndex: 1000,
            width: '100%',
            height: '100%',
            padding: 0,
            display: 'flex',
            flexWrap: 'nowrap',
            justifyContent: 'center',
            alignItems: 'center',
            pointerEvents: 'none',
          }}
        >
          <Progress style={{ width: '80vh', maxWidth: '400px' }} />
        </div>
      )}
    </>
  );
};
