import { mockup } from './mockup';
import JustValidate from '../main';
import { Rules } from '../modules/interfaces';
import { waitFor } from '@testing-library/dom';
import {
  clickBySelector,
  getAllElemsByKey,
  getElem,
  getElemByKey,
} from '../utils/testingUtils';

describe('ShowSuccessLabels method', () => {
  beforeEach(() => {
    console.warn = jest.fn();
    console.error = jest.fn();

    document.body.innerHTML = mockup;
  });

  test('invalid configuration', async () => {
    const validation = new JustValidate(document.querySelector('#form')!, {
      testingMode: true,
    });

    validation.addField('#password', [
      {
        rule: 'required' as Rules,
      },
    ]);

    expect(() => {
      // @ts-ignore
      validation.showSuccessLabels(123);
    }).toThrow();
  });

  test('should show success labels', async () => {
    const validation = new JustValidate(document.querySelector('#form')!, {
      testingMode: true,
    });

    validation.addField('#password', [
      {
        rule: 'required' as Rules,
      },
    ]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(
      getElemByKey('error-label', '#password', validation)
    ).toHaveTextContent('The field is required');

    validation.showSuccessLabels({
      '#password': 'Your password valid!',
    });

    await waitFor(() => {
      expect(
        getElemByKey('error-label', '#password', validation)
      ).not.toBeInTheDocument();
    });

    expect(
      getElemByKey('success-label', '#password', validation)
    ).toHaveTextContent('Your password valid!');
  });

  test('should show empty success label', async () => {
    const validation = new JustValidate(document.querySelector('#form')!, {
      testingMode: true,
    });

    validation.addField('#password', [
      {
        rule: 'required' as Rules,
      },
    ]);

    validation.showSuccessLabels({
      '#password': '',
    });

    await waitFor(() => {
      expect(
        getElemByKey('success-label', '#password', validation)
      ).toHaveTextContent('');
    });
  });

  test('should clear error before calling', async () => {
    const validation = new JustValidate(document.querySelector('#form')!, {
      testingMode: true,
    });

    validation.addField('#password', [
      {
        rule: 'required' as Rules,
      },
    ]);

    validation.showSuccessLabels({
      '#password': 'The password is valid',
    });

    validation.showSuccessLabels({
      '#password': 'The password is valid',
    });

    expect(
      getAllElemsByKey('success-label', '#password', validation).length
    ).toBe(1);
  });
});
