import { mockup } from './mockup';
import JustValidate from '../main';
import { Rules } from '../modules/interfaces';
import { waitFor } from '@testing-library/dom';
import {
  clickBySelector,
  getAllElemsByTestId,
  getElem,
  getElemByTestId,
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

    expect(getElemByTestId('error-label-#password')).toHaveTextContent(
      'The field is required'
    );

    validation.showSuccessLabels({
      '#password': 'Your password valid!',
    });

    await waitFor(() => {
      expect(getElemByTestId('error-label-#password')).not.toBeInTheDocument();
    });

    expect(getElemByTestId('success-label-#password')).toHaveTextContent(
      'Your password valid!'
    );
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
      expect(getElemByTestId('success-label-#password')).toHaveTextContent('');
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

    expect(getAllElemsByTestId('success-label-#password').length).toBe(1);
  });
});
