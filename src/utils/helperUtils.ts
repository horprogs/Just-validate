export const isPromise = (val: any): boolean =>
  !!val && typeof val.then === 'function';
