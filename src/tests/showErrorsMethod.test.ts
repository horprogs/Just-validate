import { mockup } from './mockup';
import JustValidate from '../main';
import { Rules } from '../modules/interfaces';
import { waitFor } from '@testing-library/dom';
import {
  changeTextBySelector,
  clickBySelector,
  getAllElemsByTestId,
  getElem,
  getElemByTestId,
} from '../utils/testingUtils';

describe('ShowErrors method', () => {
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
      validation.showErrors(123);
    }).toThrow();
  });

  test('should show errors', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate(document.querySelector('#form')!, {
      testingMode: true,
    });

    validation
      .addField('#password', [
        {
          rule: 'required' as Rules,
        },
      ])
      .onSuccess(() => {
        onSubmit();
        setTimeout(() => {
          validation.showErrors({
            '#password': 'Your password invalid!',
          });
        }, 100);
      });

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#password')).toHaveTextContent(
      'The field is required'
    );

    await changeTextBySelector('#password', '123');

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();

    await waitFor(() => {
      expect(getElemByTestId('error-label-#password')).toHaveTextContent(
        'Your password invalid!'
      );
    });

    // should call onSuccess every time, not just once
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    await waitFor(() => {
      expect(getElemByTestId('error-label-#password')).toHaveTextContent(
        'Your password invalid!'
      );
    });
  });

  test('should show empty error', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate(document.querySelector('#form')!, {
      testingMode: true,
    });

    validation
      .addField('#password', [
        {
          rule: 'required' as Rules,
        },
      ])
      .onSuccess(() => {
        onSubmit();
        setTimeout(() => {
          validation.showErrors({
            '#password': '',
          });
        }, 100);
      });

    await changeTextBySelector('#password', '123');

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();

    await waitFor(() => {
      expect(getElemByTestId('error-label-#password')).toHaveTextContent('');
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

    validation.showErrors({
      '#password': 'The password is invalid',
    });

    validation.showErrors({
      '#password': 'The password is invalid',
    });

    expect(getAllElemsByTestId('error-label-#password').length).toBe(1);
  });
});
