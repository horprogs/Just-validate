import {
  ClassListType,
  GroupFieldInterface,
  GroupFieldsInterface,
} from '../modules/interfaces';

export const isPromise = (val: any): boolean =>
  !!val && typeof val.then === 'function';

export const getNodeParents = (el: HTMLElement): HTMLElement[] => {
  let elem = el;
  const els = [];
  while (elem) {
    els.unshift(elem);
    elem = elem.parentNode as HTMLElement;
  }

  return els;
};

export const getClosestParent = (
  groups: GroupFieldsInterface,
  parents: HTMLElement[]
): [string, GroupFieldInterface] | null => {
  const reversedParents = [...parents].reverse();
  for (let i = 0, len = reversedParents.length; i < len; ++i) {
    const parent = reversedParents[i];

    for (const key in groups) {
      const group = groups[key];
      if (group.groupElem === parent) {
        return [key, group];
      }
    }
  }

  return null;
};

export const getClassList = (classList?: ClassListType): string[] => {
  if (Array.isArray(classList)) {
    return classList.filter((cls) => cls.length > 0);
  }

  if (typeof classList === 'string' && classList.trim()) {
    return [...classList.split(' ').filter((cls) => cls.length > 0)];
  }

  return [];
};
