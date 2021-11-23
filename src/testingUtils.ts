import userEvent from '@testing-library/user-event';
import { screen, fireEvent } from '@testing-library/dom';

export const clickBySelector = async (selector: string) => {
  const elem = getElem(selector);

  if (!elem) {
    return;
  }

  await userEvent.click(elem);
};

export const getElem = (selector: string) => document.querySelector(selector);

export const getElemByTestId = (id: string) =>
  document.querySelector(`[data-test-id="${id}"]`);

export const changeTextBySelector = async (selector: string, value: string) => {
  const elem = getElem(selector);

  if (!elem) {
    return;
  }

  await userEvent.type(elem, `{selectall}{del}${value}`);
};

export const selectBySelector = async (selector: string, value: string) => {
  const elem = getElem(selector);

  if (!elem) {
    return;
  }

  await userEvent.selectOptions(elem, [value]);
};

export const fetch = (time = 1000, func?: () => boolean) =>
  new Promise<boolean>((resolve) => {
    setTimeout(() => {
      resolve(func?.() || false);
    }, time);
  });
