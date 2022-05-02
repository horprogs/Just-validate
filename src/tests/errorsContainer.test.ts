import JustValidate from '../main';
import { Rules } from '../modules/interfaces';
import {
  clickBySelector,
  getAllElemsByTestId,
  getElem,
  getElemByTestId,
} from '../utils/testingUtils';
import { waitFor } from '@testing-library/dom';
import { mockup } from './mockup';

describe('Errors container', () => {
  beforeEach(() => {
    console.warn = jest.fn();
    console.error = jest.fn();

    document.body.innerHTML = mockup;
  });
  test('wrong selector', async () => {
    const onSubmit = jest.fn();
    const onFail = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
      errorsContainer: '.errors-containe',
    });

    validation
      .addField('#name', [
        {
          rule: 'required' as Rules,
        },
      ])
      .onSuccess(onSubmit)
      .onFail(onFail);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(
      getElemByTestId(
        'error-label-#name',
        document.querySelector('.errors-container')!
      )
    ).not.toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
    // @ts-ignore
    console.error.mockReset();
    expect(getAllElemsByTestId('error-label-#name')).toHaveLength(1);
  });

  test('wrong element', async () => {
    const onSubmit = jest.fn();
    const onFail = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
      errorsContainer: document.querySelector('.errors-containe'),
    });

    validation
      .addField('#name', [
        {
          rule: 'required' as Rules,
        },
      ])
      .onSuccess(onSubmit)
      .onFail(onFail);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(console.error).toHaveBeenCalled();
    // @ts-ignore
    console.error.mockReset();

    expect(
      getElemByTestId(
        'error-label-#name',
        document.querySelector('.errors-container')!
      )
    ).not.toBeInTheDocument();

    expect(getAllElemsByTestId('error-label-#name')).toHaveLength(1);
  });

  test('invalid setting', async () => {
    const onSubmit = jest.fn();
    const onFail = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
      // @ts-ignore
      errorsContainer: false,
    });

    validation
      .addField('#name', [
        {
          rule: 'required' as Rules,
        },
      ])
      .onSuccess(onSubmit)
      .onFail(onFail);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(console.error).toHaveBeenCalled();
    // @ts-ignore
    console.error.mockReset();

    expect(
      getElemByTestId(
        'error-label-#name',
        document.querySelector('.errors-container')!
      )
    ).not.toBeInTheDocument();
    expect(getAllElemsByTestId('error-label-#name')).toHaveLength(1);
  });

  test('should render errors in the container', async () => {
    const onSubmit = jest.fn();
    const onFail = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
      errorsContainer: '.errors-container',
    });

    validation
      .addField('#name', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addField('#email', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addField('#password', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addField('#message', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addField('#consent_checkbox', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addField('#favorite_animal_select', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addRequiredGroup('#read_terms_checkbox_group')
      .addRequiredGroup('#communication_radio_group')
      .onSuccess(onSubmit)
      .onFail(onFail);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(
      getElemByTestId(
        'error-label-#name',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByTestId('error-label-#name')).toHaveLength(1);

    expect(
      getElemByTestId(
        'error-label-#email',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByTestId('error-label-#email')).toHaveLength(1);

    expect(
      getElemByTestId(
        'error-label-#password',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByTestId('error-label-#password')).toHaveLength(1);

    expect(
      getElemByTestId(
        'error-label-#message',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByTestId('error-label-#message')).toHaveLength(1);

    expect(
      getElemByTestId(
        'error-label-#consent_checkbox',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByTestId('error-label-#consent_checkbox')).toHaveLength(
      1
    );

    expect(
      getElemByTestId(
        'error-label-#read_terms_checkbox_group',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByTestId('error-label-#read_terms_checkbox_group')
    ).toHaveLength(1);

    expect(
      getElemByTestId(
        'error-label-#communication_radio_group',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByTestId('error-label-#communication_radio_group')
    ).toHaveLength(1);
  });

  test('should render errors in the container (Element)', async () => {
    const onSubmit = jest.fn();
    const onFail = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
      errorsContainer: document.querySelector('.errors-container'),
    });

    validation
      .addField('#name', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addField('#email', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addField('#password', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addField('#message', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addField('#consent_checkbox', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addField('#favorite_animal_select', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addRequiredGroup('#read_terms_checkbox_group')
      .addRequiredGroup('#communication_radio_group')
      .onSuccess(onSubmit)
      .onFail(onFail);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(
      getElemByTestId(
        'error-label-#name',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByTestId('error-label-#name')).toHaveLength(1);

    expect(
      getElemByTestId(
        'error-label-#email',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByTestId('error-label-#email')).toHaveLength(1);

    expect(
      getElemByTestId(
        'error-label-#password',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByTestId('error-label-#password')).toHaveLength(1);

    expect(
      getElemByTestId(
        'error-label-#message',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByTestId('error-label-#message')).toHaveLength(1);

    expect(
      getElemByTestId(
        'error-label-#consent_checkbox',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByTestId('error-label-#consent_checkbox')).toHaveLength(
      1
    );

    expect(
      getElemByTestId(
        'error-label-#read_terms_checkbox_group',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByTestId('error-label-#read_terms_checkbox_group')
    ).toHaveLength(1);

    expect(
      getElemByTestId(
        'error-label-#communication_radio_group',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByTestId('error-label-#communication_radio_group')
    ).toHaveLength(1);
  });

  test('should render errors in the container from field config', async () => {
    const onSubmit = jest.fn();
    const onFail = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField(
        '#name',
        [
          {
            rule: 'required' as Rules,
          },
        ],
        {
          errorsContainer: '.errors-container',
        }
      )
      .addRequiredGroup('#read_terms_checkbox_group', undefined, {
        errorsContainer: '.errors-container',
      })
      .onSuccess(onSubmit)
      .onFail(onFail);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(
      getElemByTestId(
        'error-label-#name',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByTestId('error-label-#name')).toHaveLength(1);

    expect(
      getElemByTestId(
        'error-label-#read_terms_checkbox_group',
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByTestId('error-label-#read_terms_checkbox_group')
    ).toHaveLength(1);
  });
});
