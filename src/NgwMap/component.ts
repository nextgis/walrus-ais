import { forwardRef, Ref, useImperativeHandle } from 'react';
import { ElementHook } from './element';

export function createWebMapComponent<E, P>(useElement: ElementHook<E, P>) {
  function WebMapComponent(props: P, ref: Ref<E>) {
    // @ts-ignore
    const { instance } = useElement(props).current;
    useImperativeHandle(ref, () => instance);

    return null;
  }

  return forwardRef(WebMapComponent);
}
