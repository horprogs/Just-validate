import {
  changeTextBySelector,
  clickBySelector,
  fetch,
  getElem,
  getElemByTestId,
  selectBySelector,
} from '../utils/testingUtils';
import JustValidate from '../main';
import { Rules } from '../modules/interfaces';
import { fireEvent, waitFor } from '@testing-library/dom';

describe('Validation', () => {
  it('should set form as Element', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate(document.querySelector('#form')!, {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          rule: 'required' as Rules,
        },
      ])
      .onSuccess(onSubmit);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'The field is required'
    );

    await changeTextBySelector('#name', 'Georgii');

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeNull();
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should destroy the instance', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate(document.querySelector('#form')!, {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addField(
        '#email',
        [
          {
            rule: 'email' as Rules,
          },
        ],
        {
          successMessage: 'Looks good',
        }
      )
      .addRequiredGroup(
        '#read_terms_checkbox_group',
        'Invalid',
        undefined,
        'Valid'
      )
      .onSuccess(onSubmit);

    await clickBySelector('#read_terms_checkbox_group_1');
    await changeTextBySelector('#email', 'test@test.com');

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'The field is required'
    );
    expect(
      getElemByTestId('success-label-#read_terms_checkbox_group')
    ).toHaveTextContent('Valid');
    expect(getElemByTestId('success-label-#email')).toHaveTextContent(
      'Looks good'
    );

    validation.destroy();

    expect(getElemByTestId('error-label-#name')).toBeNull();
    expect(getElemByTestId('success-label-#name')).toBeNull();
    expect(getElemByTestId('error-label-#email')).toBeNull();
    expect(getElemByTestId('success-label-#email')).toBeNull();
    expect(
      getElemByTestId('success-label-#read_terms_checkbox_group')
    ).toBeNull();
    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).toBeNull();

    await clickBySelector('#submit-btn');
    expect(getElemByTestId('error-label-#name')).toBeNull();
    expect(getElemByTestId('success-label-#name')).toBeNull();
    expect(getElemByTestId('error-label-#email')).toBeNull();
    expect(getElemByTestId('success-label-#email')).toBeNull();
    expect(
      getElemByTestId('success-label-#read_terms_checkbox_group')
    ).toBeNull();
    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).toBeNull();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('should refresh the instance', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate(document.querySelector('#form')!, {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          rule: 'required' as Rules,
        },
      ])
      .onSuccess(onSubmit);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'The field is required'
    );

    validation.refresh();

    expect(getElemByTestId('error-label-#name')).toBeNull();

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'The field is required'
    );

    await changeTextBySelector('#name', 'Georgii');

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByTestId('error-label-#name')).toBeNull();
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should validate all fields and groups by basic rule', async () => {
    const onSubmit = jest.fn();
    const onFail = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
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

    expect(onSubmit).not.toHaveBeenCalled();
    expect(onFail).toHaveBeenCalled();

    expect(getElem('#form')).toHaveAttribute('novalidate', 'novalidate');
    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'The field is required'
    );
    expect(getElemByTestId('error-label-#email')).toHaveTextContent(
      'The field is required'
    );
    expect(getElemByTestId('error-label-#password')).toHaveTextContent(
      'The field is required'
    );
    expect(getElemByTestId('error-label-#password')).toHaveTextContent(
      'The field is required'
    );
    expect(getElemByTestId('error-label-#message')).toHaveTextContent(
      'The field is required'
    );
    expect(getElemByTestId('error-label-#consent_checkbox')).toHaveTextContent(
      'The field is required'
    );
    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).toHaveTextContent('The field is required');
    expect(
      getElemByTestId('error-label-#communication_radio_group')
    ).toHaveTextContent('The field is required');
  });

  it('should be able submit form if validation passed', async () => {
    const onSubmit = jest.fn();
    const onFail = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
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

    await changeTextBySelector('#name', 'Georgii');
    await changeTextBySelector('#email', 'test@test.com');
    await changeTextBySelector('#password', '1234');
    await changeTextBySelector('#message', 'Hi');
    await clickBySelector('#consent_checkbox');
    await clickBySelector('#read_terms_checkbox_group_1');
    await clickBySelector('#communication_radio_group_1');
    selectBySelector('#favorite_animal_select', 'dog');

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onFail).not.toHaveBeenCalled();

    expect(getElem('#form')).toHaveAttribute('novalidate', 'novalidate');
    expect(getElemByTestId('error-label-#name')).toBeNull();
    expect(getElemByTestId('error-label-#email')).toBeNull();
    expect(getElemByTestId('error-label-#password')).toBeNull();
    expect(getElemByTestId('error-label-#password')).toBeNull();
    expect(getElemByTestId('error-label-#message')).toBeNull();
    expect(getElemByTestId('error-label-#consent_checkbox')).toBeNull();
    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).toBeNull();
    expect(
      getElemByTestId('error-label-#communication_radio_group')
    ).toBeNull();

    expect(getElem('#name')).toHaveValue('Georgii');
    expect(getElem('#email')).toHaveValue('test@test.com');
    expect(getElem('#password')).toHaveValue('1234');
    expect(getElem('#message')).toHaveValue('Hi');
    expect(getElem('#consent_checkbox')).toBeChecked();
    expect(getElem('#communication_radio_group_1')).toBeChecked();
    expect(getElem('#read_terms_checkbox_group_1')).toBeChecked();
    expect(getElem('#favorite_animal_select')).toHaveValue('dog');
  });

  it('should be able to show conditional custom error messages', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          validator: (val): boolean => {
            switch (val) {
              case 'Z':
              case 'X':
              case 'C':
              case '.':
                return false;
              default:
                return true;
            }
          },
          errorMessage: (val): string => {
            switch (val) {
              case 'Z':
              case 'X':
              case 'C':
                return 'You cannot use Z/X/C as names';
              default:
                return 'Name is invalid';
            }
          },
        },
      ])
      .onSuccess(onSubmit);

    await changeTextBySelector('#name', 'Z');
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'You cannot use Z/X/C as names'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    await changeTextBySelector('#name', 'X');
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'You cannot use Z/X/C as names'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    await changeTextBySelector('#name', 'C');
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'You cannot use Z/X/C as names'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    await changeTextBySelector('#name', '.');
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'Name is invalid'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    await changeTextBySelector('#name', '123123123');
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();
  });

  it('should be able to validate by different rules', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          rule: 'required' as Rules,
        },
        {
          rule: 'minLength' as Rules,
          value: 3,
        },
        {
          rule: 'maxLength' as Rules,
          value: 15,
        },
      ])
      .addField('#email', [
        {
          rule: 'required' as Rules,
        },
        {
          rule: 'email' as Rules,
        },
      ])
      .addField('#password', [
        {
          rule: 'required' as Rules,
        },
        {
          rule: 'number' as Rules,
        },
      ])
      .onSuccess(onSubmit);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'The field is required'
    );
    expect(getElemByTestId('error-label-#email')).toHaveTextContent(
      'The field is required'
    );
    expect(getElemByTestId('error-label-#password')).toHaveTextContent(
      'The field is required'
    );

    await changeTextBySelector('#name', 'Ge');
    await changeTextBySelector('#email', 'testtest.com');
    await changeTextBySelector('#password', 'qqq');

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'The field must contain a minimum of 3 characters'
    );
    expect(getElemByTestId('error-label-#email')).toHaveTextContent(
      'Email has invalid format'
    );
    expect(getElemByTestId('error-label-#password')).toHaveTextContent(
      'Value should be a number'
    );

    await changeTextBySelector('#name', 'Geooooooooooooooooooo');
    await changeTextBySelector('#email', 'test@testcom');
    await changeTextBySelector('#password', '1234d');

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'The field must contain a maximum of 15 characters'
    );
    expect(getElemByTestId('error-label-#email')).toHaveTextContent(
      'Email has invalid format'
    );
    expect(getElemByTestId('error-label-#password')).toHaveTextContent(
      'Value should be a number'
    );

    await changeTextBySelector('#name', 'Geooooooooo');
    await changeTextBySelector('#email', 'test@test.com');
    await changeTextBySelector('#password', '1234');

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByTestId('error-label-#name')).toBeNull();
    expect(getElemByTestId('error-label-#email')).toBeNull();
    expect(getElemByTestId('error-label-#password')).toBeNull();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it('should be able to validate by custom sync rule', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          validator: (value): boolean => value[0] === '!',
        },
      ])
      .onSuccess(onSubmit);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'Value is incorrect'
    );

    await changeTextBySelector('#name', 'Georgii');

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'Value is incorrect'
    );

    await changeTextBySelector('#name', '!Georgii');

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);

    expect(getElemByTestId('error-label-#name')).toBeNull();
  });

  it('should be able to validate by custom async rule', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          validator: (value) => (): Promise<boolean> =>
            fetch(100, () => {
              return !!value;
            }),
        },
      ])
      .onSuccess(onSubmit);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'Value is incorrect'
    );

    await changeTextBySelector('#name', 'Georgii');

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);

    expect(getElemByTestId('error-label-#name')).toBeNull();
  });

  it('should be able to render tooltips', async () => {
    jest
      .spyOn(window, 'requestAnimationFrame')
      .mockImplementation((callback: FrameRequestCallback): number => {
        callback(0);
        return 0;
      });
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
      tooltip: {
        position: 'top',
      },
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
          tooltip: {
            position: 'right',
          },
        }
      )
      .addField(
        '#email',
        [
          {
            rule: 'required' as Rules,
          },
        ],
        {
          tooltip: {
            position: 'bottom',
          },
        }
      )
      .addField(
        '#password',
        [
          {
            rule: 'required' as Rules,
          },
        ],
        {
          tooltip: {
            position: 'left',
          },
        }
      )
      .addField(
        '#message',
        [
          {
            rule: 'required' as Rules,
          },
        ],
        {
          tooltip: {
            position: 'top',
          },
        }
      )
      .onSuccess(onSubmit);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'The field is required'
    );
    expect(getElemByTestId('error-label-#name')).toHaveAttribute(
      'data-direction',
      'right'
    );
    expect(getElemByTestId('error-label-#name')).toHaveAttribute(
      'data-tooltip',
      'true'
    );
    expect(getElemByTestId('error-label-#name')).toHaveStyle('left:5px');
    expect(getElemByTestId('error-label-#name')).toHaveStyle('top:0px');

    expect(getElemByTestId('error-label-#email')).toHaveTextContent(
      'The field is required'
    );
    expect(getElemByTestId('error-label-#email')).toHaveAttribute(
      'data-direction',
      'bottom'
    );
    expect(getElemByTestId('error-label-#email')).toHaveAttribute(
      'data-tooltip',
      'true'
    );
    expect(getElemByTestId('error-label-#email')).toHaveStyle('left:0px');
    expect(getElemByTestId('error-label-#email')).toHaveStyle('top:5px');

    expect(getElemByTestId('error-label-#password')).toHaveTextContent(
      'The field is required'
    );
    expect(getElemByTestId('error-label-#password')).toHaveAttribute(
      'data-direction',
      'left'
    );
    expect(getElemByTestId('error-label-#password')).toHaveAttribute(
      'data-tooltip',
      'true'
    );
    expect(getElemByTestId('error-label-#password')).toHaveStyle('left:-5px');
    expect(getElemByTestId('error-label-#password')).toHaveStyle('top:0px');

    expect(getElemByTestId('error-label-#message')).toHaveTextContent(
      'The field is required'
    );
    expect(getElemByTestId('error-label-#message')).toHaveAttribute(
      'data-direction',
      'top'
    );
    expect(getElemByTestId('error-label-#message')).toHaveAttribute(
      'data-tooltip',
      'true'
    );
    expect(getElemByTestId('error-label-#message')).toHaveStyle('left:0px');
    expect(getElemByTestId('error-label-#message')).toHaveStyle('top:-5px');

    validation.tooltips.forEach((item) => {
      item.refresh = jest.fn();
    });

    await fireEvent.scroll(document, { target: { scrollY: 100 } });

    validation.tooltips.forEach((item) => {
      expect(item.refresh).toHaveBeenCalled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    // @ts-ignore
    window.requestAnimationFrame.mockRestore();
  });

  it('should not show success labels if async func has not finished', async () => {
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
          {
            validator: (val) => (): Promise<boolean> =>
              new Promise((resolve) => {
                setTimeout(() => {
                  resolve(val === 'Georgii');
                }, 1);
              }),
          },
        ],
        {
          successMessage: 'Name looks good',
        }
      )
      .onSuccess(onSubmit);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    await changeTextBySelector('#name', 'Test');
    expect(getElemByTestId('success-label-#name')).not.toBeInTheDocument();
    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByTestId('success-label-#name')).not.toBeInTheDocument();
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();

    await changeTextBySelector('#name', 'Georgii');
    expect(getElemByTestId('success-label-#name')).not.toBeInTheDocument();
    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('success-label-#name')).toBeInTheDocument();
    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();
  });

  it('should be able to use plugin', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          plugin: (value): boolean => value === 'test',
        },
      ])
      .onSuccess(onSubmit);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    await changeTextBySelector('#name', 'test');

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();
  });

  it('should be able to validate non-string value fields', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#consent_checkbox', [
        {
          rule: Rules.Email,
        },
      ])
      .onSuccess(onSubmit);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#consent_checkbox')).toHaveTextContent(
      'Email has invalid format'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    validation.addField('#consent_checkbox', [
      {
        rule: Rules.MaxLength,
        value: 10,
      },
    ]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#consent_checkbox')).toHaveTextContent(
      'The field must contain a maximum of 10 characters'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    validation.addField('#consent_checkbox', [
      {
        rule: Rules.MinLength,
        value: 10,
      },
    ]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#consent_checkbox')).toHaveTextContent(
      'The field must contain a minimum of 10 characters'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    validation.addField('#consent_checkbox', [
      {
        rule: Rules.Password,
      },
    ]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#consent_checkbox')).toHaveTextContent(
      'Password must contain minimum eight characters, at least one letter and one number'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    validation.addField('#consent_checkbox', [
      {
        rule: Rules.StrongPassword,
      },
    ]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#consent_checkbox')).toHaveTextContent(
      'Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    validation.addField('#consent_checkbox', [
      {
        rule: Rules.Number,
      },
    ]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#consent_checkbox')).toHaveTextContent(
      'Value should be a number'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    validation.addField('#consent_checkbox', [
      {
        rule: Rules.MaxNumber,
        value: 10,
      },
    ]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#consent_checkbox')).toHaveTextContent(
      'Number should be less or equal than 10'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    validation.addField('#consent_checkbox', [
      {
        rule: Rules.MinNumber,
        value: 10,
      },
    ]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#consent_checkbox')).toHaveTextContent(
      'Number should be more or equal than 10'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
  });

  it('should be able to read FormData in onSuccess callback', async () => {
    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    let formData: FormData;

    validation
      .addField('#name', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addField('#email', [
        {
          validator: () => (): Promise<boolean> =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve(true);
              }, 1);
            }),
        },
      ])
      .onSuccess((ev) => {
        ev?.preventDefault();
        formData = new FormData(ev!.target as HTMLFormElement);
      });

    await changeTextBySelector('#name', 'Georgii');
    await changeTextBySelector('#email', 'test@test.com');

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    await waitFor(() => {
      const object: any = {};
      formData.forEach((value, key) => (object[key] = value));
      expect(object.name).toBe('Georgii');
      expect(object.email).toBe('test@test.com');
    });
  });

  it('should revalidate the field', async () => {
    const onSubmit = jest.fn();
    const onFail = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addField('#email', [
        {
          rule: 'email' as Rules,
        },
      ])
      .onSuccess(onSubmit)
      .onFail(onFail);

    expect(() => {
      // @ts-ignore
      validation.revalidateField(123);
    }).toThrow();

    await expect(validation.revalidateField('.123')).rejects.toBe(undefined);

    expect(console.error).toHaveBeenCalled();
    // @ts-ignore
    console.error.mockReset();

    await changeTextBySelector('#name', 'Test');
    await changeTextBySelector('#email', 'test');

    await expect(validation.revalidateField('#email')).resolves.toBe(false);

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();

    await waitFor(() => {
      expect(getElemByTestId('error-label-#email')).toBeInTheDocument();
    });

    await changeTextBySelector('#email', 'test@test.com');

    await expect(validation.revalidateField('#email')).resolves.toBe(true);

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
  });

  it('should revalidate the form', async () => {
    const onSubmit = jest.fn();
    const onFail = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          rule: 'required' as Rules,
        },
      ])
      .onSuccess(onSubmit)
      .onFail(onFail);

    await expect(validation.revalidate()).resolves.toBe(false);
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    await changeTextBySelector('#name', 'Test');

    await expect(validation.revalidate()).resolves.toBe(true);
    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();
  });

  it('should not reset disabled attr unlockForm', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#password', [
        {
          validator: () => (): Promise<boolean> =>
            fetch(100, () => {
              return true;
            }),
        },
      ])
      .onSuccess(onSubmit);

    document.querySelector('#custom-btn')!.setAttribute('disabled', 'true');

    expect(getElem('#submit-btn')).toBeEnabled();
    expect(getElem('#custom-btn')).toBeDisabled();

    await clickBySelector('#submit-btn');

    expect(getElem('#submit-btn')).toBeDisabled();
    expect(getElem('#custom-btn')).toBeDisabled();

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalled();
    });

    expect(getElem('#submit-btn')).toBeEnabled();
    expect(getElem('#custom-btn')).toBeDisabled();
  });

  it('should not show errors before submitting', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#email', [
        {
          rule: 'email' as Rules,
        },
      ])
      .addField('#password', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addRequiredGroup(
        '#read_terms_checkbox_group',
        'Invalid',
        undefined,
        'Valid'
      )
      .onSuccess(onSubmit);

    expect(getElemByTestId('error-label-#email')).not.toBeInTheDocument();
    await changeTextBySelector('#email', 'test');
    expect(getElemByTestId('error-label-#email')).not.toBeInTheDocument();
  });

  it('should validate before submitting', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
      validateBeforeSubmitting: true,
    });

    validation
      .addField('#email', [
        {
          rule: 'email' as Rules,
        },
      ])
      .addField('#password', [
        {
          rule: 'required' as Rules,
        },
      ])
      .addRequiredGroup(
        '#read_terms_checkbox_group',
        'Invalid',
        undefined,
        'Valid'
      )
      .onSuccess(onSubmit);

    expect(getElemByTestId('error-label-#email')).not.toBeInTheDocument();
    expect(getElemByTestId('error-label-#password')).not.toBeInTheDocument();
    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).not.toBeInTheDocument();

    await changeTextBySelector('#email', 'test');
    expect(getElemByTestId('error-label-#email')).toBeInTheDocument();
    expect(getElemByTestId('error-label-#password')).not.toBeInTheDocument();
    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).not.toBeInTheDocument();

    await changeTextBySelector('#email', 'test@test.com');
    expect(getElemByTestId('error-label-#email')).not.toBeInTheDocument();
    expect(getElemByTestId('error-label-#password')).not.toBeInTheDocument();
    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).not.toBeInTheDocument();

    await clickBySelector('#submit-btn');

    expect(getElemByTestId('error-label-#email')).not.toBeInTheDocument();
    expect(getElemByTestId('error-label-#password')).toBeInTheDocument();
    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).toBeInTheDocument();

    await changeTextBySelector('#email', 'test');
    expect(getElemByTestId('error-label-#email')).toBeInTheDocument();
    expect(getElemByTestId('error-label-#password')).toBeInTheDocument();
    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).toBeInTheDocument();
  });
});
