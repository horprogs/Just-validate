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
  const list = [];

  if (Array.isArray(classList)) {
    list.push(...classList);
  } else if (typeof classList === 'string' && classList.trim()) {
    list.push(...classList.trim().split(' '));
  }

  return list;
};
