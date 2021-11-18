export const isPromise = (val: any) => !!val && typeof val.then === 'function';
