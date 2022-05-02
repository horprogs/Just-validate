import userEvent from '@testing-library/user-event';

export const clickBySelector = async (selector: string): Promise<void> => {
  const elem = getElem(selector);

  if (!elem) {
    return;
  }

  await userEvent.click(elem);
};

export const getElem = (selector: string): Element | null =>
  document.querySelector(selector);

export const getElemByTestId = (id: string, parent?: Element): Element | null =>
  (parent !== undefined ? parent : document).querySelector(
    `[data-test-id="${id}"]`
  );

export const getAllElemsByTestId = (
  id: string,
  parent?: Element
): NodeListOf<Element> =>
  (parent || document).querySelectorAll(`[data-test-id="${id}"]`);

export const changeTextBySelector = async (
  selector: string,
  value: string
): Promise<void> => {
  const elem = getElem(selector);

  if (!elem) {
    new Error(`Element ${selector} not found`);
    return;
  }

  await userEvent.clear(elem);

  if (value) {
    await userEvent.type(elem, value);
  }
};

export const selectBySelector = async (
  selector: string,
  value: string
): Promise<void> => {
  const elem = getElem(selector);

  if (!elem) {
    return;
  }

  await userEvent.selectOptions(elem, [value]);
};

export const fetch = (time = 1000, func?: () => boolean): Promise<boolean> =>
  new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(func?.() || false);
    }, time);
  });

export const generateFileContent = (size: number): Array<string> => [
  new Array(size).fill('1').join(''),
];
