/**
 * @packageDocumentation
 * @module @lib/decorators
 *
 * Debugging purposes.
 * Restricted in non DEV mode.
 */

import { log } from "@Macro/log.macro";

/**
 * Measure method execution time and log execution info.
 */
export const DebugMeasure = (): MethodDecorator => <T>(target: any, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<T>): any => {

  // todo: Update.

  /* <production> */
  throw new Error("Debugging utils are only available for DEV environment.");
  /* </production> */

  let originalFunction: any;

  if (descriptor.value) {
    originalFunction = target[propertyKey];
  } else {
    originalFunction = descriptor.get;
  }

  const measureFunction = (...params: Array<any>): any => {

    const start: number = Date.now();
    const returnValue = originalFunction(...params);
    const duration: number = Date.now() - start;

    log.info(`${target.constructor.name}[${propertyKey.toString()}]: ${duration ? duration : "±0"}ms.`);

    return returnValue;
  };

  if (descriptor.value) {
    // @ts-ignore
    descriptor.value = measureFunction;
  } else {
    descriptor.get = measureFunction;
  }

  return descriptor;
};

/**
 * Expose class to a window for temporary debugging.
 */
export const DebugExpose = (name?: string): ClassDecorator => (descriptor: object): any => {

  /* <production> */
  throw new Error("Debugging utils are only available for DEV environment.");
  /* </production> */

  // @ts-ignore
  if (!window.exposed) {
    // @ts-ignore
    window.exposed = {};
  }


  return {
    ...descriptor,
    finisher: (target: any) => (
      class extends target {

        constructor(...params: Array<any>) {
          super(params);

          // @ts-ignore
          window.exposed[name || target.name] = this;
        }
      }
    )
  };
};
