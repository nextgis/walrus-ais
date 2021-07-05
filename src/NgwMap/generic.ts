import { ControlOptions } from '@nextgis/webmap';
import { createWebMapComponent } from './component';
import { NgwMapContextInterface } from './context';
import { createControlHook } from './control';
import { createElementHook, NgwMapElement } from './element';

export function createControlComponent<E extends any, P extends ControlOptions>(
  createInstance: (props: P, context: NgwMapContextInterface) => E,
) {
  function createElement(
    props: P,
    context: NgwMapContextInterface,
  ): NgwMapElement<E> {
    return { instance: createInstance(props, context), context };
  }
  const useElement = createElementHook(createElement);
  const useControl = createControlHook(useElement);
  return createWebMapComponent(useControl);
}
