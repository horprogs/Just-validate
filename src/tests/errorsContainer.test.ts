import JustValidate from '../main';
import { Rules } from '../modules/interfaces';
import {
  clickBySelector,
  getAllElemsByKey,
  getElem,
  getElemByKey,
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
      getElemByKey(
        'error-label',
        '#name',
        validation,
        document.querySelector('.errors-container')!
      )
    ).not.toBeInTheDocument();
    expect(console.error).toHaveBeenCalled();
    // @ts-ignore
    console.error.mockReset();
    expect(getAllElemsByKey('error-label', '#name', validation)).toHaveLength(
      1
    );
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
      getElemByKey(
        'error-label',
        '#name',
        validation,
        document.querySelector('.errors-container')!
      )
    ).not.toBeInTheDocument();

    expect(getAllElemsByKey('error-label', '#name', validation)).toHaveLength(
      1
    );
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
      getElemByKey(
        'error-label',
        '#name',
        validation,
        document.querySelector('.errors-container')!
      )
    ).not.toBeInTheDocument();
    expect(getAllElemsByKey('error-label', '#name', validation)).toHaveLength(
      1
    );
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
      getElemByKey(
        'error-label',
        '#name',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByKey('error-label', '#name', validation)).toHaveLength(
      1
    );

    expect(
      getElemByKey(
        'error-label',
        '#email',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByKey('error-label', '#email', validation)).toHaveLength(
      1
    );

    expect(
      getElemByKey(
        'error-label',
        '#password',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByKey('error-label', '#password', validation)
    ).toHaveLength(1);

    expect(
      getElemByKey(
        'error-label',
        '#message',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByKey('error-label', '#message', validation)
    ).toHaveLength(1);

    expect(
      getElemByKey(
        'error-label',
        '#consent_checkbox',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByKey('error-label', '#consent_checkbox', validation)
    ).toHaveLength(1);

    expect(
      getElemByKey(
        'error-label',
        '#read_terms_checkbox_group',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByKey('error-label', '#read_terms_checkbox_group', validation)
    ).toHaveLength(1);

    expect(
      getElemByKey(
        'error-label',
        '#communication_radio_group',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByKey('error-label', '#communication_radio_group', validation)
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
      getElemByKey(
        'error-label',
        '#name',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByKey('error-label', '#name', validation)).toHaveLength(
      1
    );

    expect(
      getElemByKey(
        'error-label',
        '#email',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByKey('error-label', '#email', validation)).toHaveLength(
      1
    );

    expect(
      getElemByKey(
        'error-label',
        '#password',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByKey('error-label', '#password', validation)
    ).toHaveLength(1);

    expect(
      getElemByKey(
        'error-label',
        '#message',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByKey('error-label', '#message', validation)
    ).toHaveLength(1);

    expect(
      getElemByKey(
        'error-label',
        '#consent_checkbox',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByKey('error-label', '#consent_checkbox', validation)
    ).toHaveLength(1);

    expect(
      getElemByKey(
        'error-label',
        '#read_terms_checkbox_group',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByKey('error-label', '#read_terms_checkbox_group', validation)
    ).toHaveLength(1);

    expect(
      getElemByKey(
        'error-label',
        '#communication_radio_group',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByKey('error-label', '#communication_radio_group', validation)
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
      getElemByKey(
        'error-label',
        '#name',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(getAllElemsByKey('error-label', '#name', validation)).toHaveLength(
      1
    );

    expect(
      getElemByKey(
        'error-label',
        '#read_terms_checkbox_group',
        validation,
        document.querySelector('.errors-container')!
      )
    ).toHaveTextContent('The field is required');
    expect(
      getAllElemsByKey('error-label', '#read_terms_checkbox_group', validation)
    ).toHaveLength(1);
  });
});
