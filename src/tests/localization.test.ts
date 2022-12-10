import JustValidate, { Rules } from '../main';
import {
  changeTextBySelector,
  clickBySelector,
  getElem,
  getElemByKey,
} from '../utils/testingUtils';
import { waitFor } from '@testing-library/dom';

describe('localization', () => {
  it('should be able to change language', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate(
      '#form',
      {
        testingMode: true,
      },
      [
        {
          key: 'Name is invalid',
          dict: {
            ru: 'Имя некорректно',
          },
        },
      ]
    );

    validation.addField('#name', [
      {
        rule: 'required' as Rules,
        errorMessage: 'Name is invalid',
      },
    ]);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByKey('error-label', '#name', validation)).toHaveTextContent(
      'Name is invalid'
    );

    // @ts-ignore
    validation.setCurrentLocale(123);

    expect(console.error).toHaveBeenCalled();

    validation.setCurrentLocale('ru');

    await waitFor(() => {
      expect(
        getElemByKey('error-label', '#name', validation)
      ).toHaveTextContent('Имя некорректно');
    });

    validation.setCurrentLocale();
    await waitFor(() => {
      expect(
        getElemByKey('error-label', '#name', validation)
      ).toHaveTextContent('Name is invalid');
    });

    validation.setCurrentLocale('en');

    await waitFor(() => {
      expect(
        getElemByKey('error-label', '#name', validation)
      ).toHaveTextContent('Name is invalid');
    });

    validation.setCurrentLocale('qq');

    await waitFor(() => {
      expect(
        getElemByKey('error-label', '#name', validation)
      ).toHaveTextContent('Name is invalid');
    });
  });

  it('should be able to show custom error messages', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          rule: 'required' as Rules,
          errorMessage: 'Name is required',
        },
      ])
      .addField('#consent_checkbox', [
        {
          rule: 'required' as Rules,
          errorMessage: 'Consent checkbox is required',
        },
      ])
      .addField('#favorite_animal_select', [
        {
          rule: 'required' as Rules,
          errorMessage: 'Animal select is required',
        },
      ])
      .addRequiredGroup(
        '#read_terms_checkbox_group',
        'At least one term is required'
      )
      .addRequiredGroup(
        '#communication_radio_group',
        'Communication channel is required'
      )
      .onSuccess(onSubmit);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByKey('error-label', '#name', validation)).toHaveTextContent(
      'Name is required'
    );
    expect(
      getElemByKey('error-label', '#consent_checkbox', validation)
    ).toHaveTextContent('Consent checkbox is required');
    expect(
      getElemByKey('error-label', '#read_terms_checkbox_group', validation)
    ).toHaveTextContent('At least one term is required');
    expect(
      getElemByKey('error-label', '#communication_radio_group', validation)
    ).toHaveTextContent('Communication channel is required');
    expect(
      getElemByKey('error-label', '#favorite_animal_select', validation)
    ).toHaveTextContent('Animal select is required');
  });

  it('should be able to show success labels', async () => {
    const onSubmit = jest.fn();

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
          successMessage: 'Name looks good',
        }
      )
      .addField(
        '#email',
        [
          {
            rule: 'required' as Rules,
          },
          {
            rule: 'email' as Rules,
            errorMessage: 'Email is invalid',
          },
        ],
        {
          successMessage: 'Email looks good',
        }
      )
      .addRequiredGroup(
        '#read_terms_checkbox_group',
        'Group is invalid',
        undefined,
        'Group looks good'
      )
      .onSuccess(onSubmit);

    await changeTextBySelector('#name', 'Georgii');
    await changeTextBySelector('#email', '123');

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(
      getElemByKey('error-label', '#name', validation)
    ).not.toBeInTheDocument();
    expect(
      getElemByKey('success-label', '#name', validation)
    ).toHaveTextContent('Name looks good');
    expect(
      getElemByKey('success-label', '#email', validation)
    ).not.toBeInTheDocument();
    expect(getElemByKey('error-label', '#email', validation)).toHaveTextContent(
      'Email is invalid'
    );
    expect(
      getElemByKey('success-label', '#read_terms_checkbox_group', validation)
    ).not.toBeInTheDocument();
    expect(
      getElemByKey('error-label', '#read_terms_checkbox_group', validation)
    ).toHaveTextContent('Group is invalid');

    await clickBySelector('#read_terms_checkbox_group_1');
    await changeTextBySelector('#email', 'test@test.com');

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();

    expect(
      getElemByKey('error-label', '#email', validation)
    ).not.toBeInTheDocument();
    expect(
      getElemByKey('error-label', '#name', validation)
    ).not.toBeInTheDocument();
    expect(
      getElemByKey('success-label', '#email', validation)
    ).toHaveTextContent('Email looks good');
    expect(
      getElemByKey('success-label', '#name', validation)
    ).toHaveTextContent('Name looks good');
    expect(
      getElemByKey('success-label', '#read_terms_checkbox_group', validation)
    ).toHaveTextContent('Group looks good');
    expect(
      getElemByKey('error-label', '#read_terms_checkbox_group', validation)
    ).not.toBeInTheDocument();
  });

  it('should show messages from default dictionary if no translations and no custom message', async () => {
    const validation = new JustValidate(
      '#form',
      {
        testingMode: true,
      },
      [
        {
          key: 'Some key',
          dict: {},
        },
      ]
    );

    validation.addField('#name', [
      {
        rule: 'required' as Rules,
      },
    ]);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByKey('error-label', '#name', validation)).toHaveTextContent(
      'The field is required'
    );
  });

  it('should show default message if no rule and no custom message', async () => {
    const validation = new JustValidate(
      '#form',
      {
        testingMode: true,
      },
      [
        {
          key: 'Some key',
          dict: {},
        },
      ]
    );

    validation.addField('#name', [
      {
        validator: (): boolean => false,
      },
    ]);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByKey('error-label', '#name', validation)).toHaveTextContent(
      'Value is incorrect'
    );
  });

  it('should show custom message if no rule', async () => {
    const validation = new JustValidate(
      '#form',
      {
        testingMode: true,
      },
      [
        {
          key: 'Some key',
          dict: {},
        },
      ]
    );

    validation.addField('#name', [
      {
        validator: (): boolean => false,
        errorMessage: 'Custom error',
      },
    ]);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByKey('error-label', '#name', validation)).toHaveTextContent(
      'Custom error'
    );
  });

  it('should translate custom message if no rule', async () => {
    const validation = new JustValidate(
      '#form',
      {
        testingMode: true,
      },
      [
        {
          key: 'Custom error',
          dict: {
            ru: 'Ошибка',
          },
        },
      ]
    );

    validation.addField('#name', [
      {
        validator: (): boolean => false,
        errorMessage: 'Custom error',
      },
    ]);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByKey('error-label', '#name', validation)).toHaveTextContent(
      'Custom error'
    );

    validation.setCurrentLocale('ru');

    await waitFor(() => {
      expect(
        getElemByKey('error-label', '#name', validation)
      ).toHaveTextContent('Ошибка');
    });
  });

  it('should replace :value for translated messages', async () => {
    const validation = new JustValidate(
      '#form',
      {
        testingMode: true,
      },
      [
        {
          key: 'Min :value',
          dict: {
            ru: 'Мин :value',
          },
        },
      ]
    );

    validation.addField('#name', [
      {
        rule: 'minLength' as Rules,
        value: 3,
        errorMessage: 'Min :value',
      },
    ]);

    await changeTextBySelector('#name', 't');
    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByKey('error-label', '#name', validation)).toHaveTextContent(
      'Min 3'
    );

    validation.setCurrentLocale('ru');

    await waitFor(() => {
      expect(
        getElemByKey('error-label', '#name', validation)
      ).toHaveTextContent('Мин 3');
    });
  });

  it('should replace :value for translated messages if no custom message', async () => {
    const validation = new JustValidate(
      '#form',
      {
        testingMode: true,
      },
      []
    );

    validation.addField('#name', [
      {
        rule: 'minLength' as Rules,
        value: 3,
      },
    ]);

    await changeTextBySelector('#name', 't');
    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByKey('error-label', '#name', validation)).toHaveTextContent(
      'The field must contain a minimum of 3 characters'
    );

    validation.setCurrentLocale('ru');

    await waitFor(() => {
      expect(
        getElemByKey('error-label', '#name', validation)
      ).toHaveTextContent('The field must contain a minimum of 3 characters');
    });
  });
});
