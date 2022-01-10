import {
  changeTextBySelector,
  clickBySelector,
  fetch,
  generateFileContent,
  getElem,
  getElemByTestId,
  selectBySelector,
} from '../utils/testingUtils';
import JustValidate from '../main';
import { Rules } from '../modules/interfaces';
import { fireEvent, screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('Validation', () => {
  beforeEach(() => {
    console.warn = jest.fn();
    console.error = jest.fn();

    document.body.innerHTML = `
<form action='#' class='row g-3' id='form' autocomplete='off'>
      <div class='row'>
        <div class='col-md-6'>
          <label for='name'>Enter your name</label>
          <input
            type='text'
            class='form__input form-control'
            placeholder='Enter your name'
            autocomplete='off'
            name='name'
            id='name'
          />
        </div>
        <div class='col-md-6'>
          <label for='email'>Enter your email</label>
          <input
            type='email'
            class='form__input form-control'
            placeholder='Enter your email'
            autocomplete='off'
            name='email'
            id='email'
          />
        </div>
      </div>
      <div class='form-group'>
        <label for='password'>Enter your password</label>
        <input
          type='password'
          class='form__input form-control'
          placeholder='Enter your password'
          autocomplete='off'
          name='password'
          id='password'
        />
      </div>
      <div class='form-group'>
        <label for='password'>Repeat your password</label>
        <input
          type='password'
          class='form__input form-control'
          placeholder='Repeat your password'
          autocomplete='off'
          name='repeat-password'
          id='repeat-password'
        />
      </div>
      <div class='form-group'>
        <label for='password'>Enter your message</label>
        <textarea
          name='msg'
          cols='30'
          rows='10'
          class='form__textarea form-control'
          id='message'
        ></textarea>
      </div>
      <div class='form-group'>
        <input
          type='checkbox'
          id='consent_checkbox'
          class='form__checkbox'
        /><label for='consent_checkbox'>I agree</label>
      </div>
      <div class='form-group' id='read_terms_checkbox_group' style='width: 250px'>
        <label
          ><input
            type='checkbox'
            name='checkbox-group-fruit'
            id='read_terms_checkbox_group_1'
            class='form__checkbox'
          />I have read Privacy Policy</label
        >
        <label
          ><input
            type='checkbox'
            name='checkbox-group-fruit'
            id='read_terms_checkbox_group_2'
            class='form__checkbox'
          />I have read Terms Of Use</label
        >
        <label
          ><input
            type='checkbox'
            name='checkbox-group-fruit'
            id='read_terms_checkbox_group_3'
            class='form__checkbox'
          />I have read Cookies Policy</label
        >
      </div>
      <div class='row'>
        <div class='col-2'>
          <div class='form-check' id='communication_radio_group'>
            <input
              type='radio'
              name='radio'
              class='form-check-input'
              id='communication_radio_group_1'
            />
            <label class='form-check-label' for='communication_radio_group_1'>
              Email
            </label>
            <br />
            <input
              type='radio'
              name='radio'
              class='form-check-input'
              id='communication_radio_group_2'
            />
            <label class='form-check-label' for='communication_radio_group_2'>
              SMS
            </label>
          </div>
        </div>
      </div>

      <div class='form-group'>
        <label for='favorite_animal_select' class='form-label'>Select you favorite animal</label>
        <select name='pets' id='favorite_animal_select' class='form-select'>
          <option value=''>--Please choose an option--</option>
          <option value='dog'>Dog</option>
          <option value='cat'>Cat</option>
          <option value='hamster'>Hamster</option>
          <option value='parrot'>Parrot</option>
          <option value='spider'>Spider</option>
          <option value='goldfish'>Goldfish</option>
        </select>
      </div>
      
      <div class="row">
        <div class="col">
          <label for="files">Upload your files</label>
          <input
            type="file"
            class="form__input form-control"
            placeholder="Upload your files"
            autocomplete="off"
            name="files"
            id="files"
            multiple
          />
        </div>
      </div>

      <button class='btn btn-primary' id="submit-btn">Submit</button>
`;
  });
  test('should set form as Element', async () => {
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

    clickBySelector('#submit-btn');
    expect(getElem('button')).toBeDisabled();

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'The field is required'
    );

    changeTextBySelector('#name', 'Georgii');

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeNull();
    expect(onSubmit).toHaveBeenCalled();
  });

  test('should destroy the instance', async () => {
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

    clickBySelector('#read_terms_checkbox_group_1');
    changeTextBySelector('#email', 'test@test.com');

    clickBySelector('#submit-btn');
    expect(getElem('button')).toBeDisabled();

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
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

    clickBySelector('#submit-btn');
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

  test('should refresh the instance', async () => {
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

    clickBySelector('#submit-btn');
    expect(getElem('button')).toBeDisabled();

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'The field is required'
    );

    validation.refresh();

    expect(getElemByTestId('error-label-#name')).toBeNull();

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'The field is required'
    );

    changeTextBySelector('#name', 'Georgii');

    clickBySelector('#submit-btn');
    expect(getElem('button')).toBeDisabled();

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(getElemByTestId('error-label-#name')).toBeNull();
    expect(onSubmit).toHaveBeenCalled();
  });

  test('should throw errors if setting invalid', async () => {
    const onSubmit = jest.fn();
    expect(() => {
      new JustValidate('#for', {
        testingMode: true,
      });
    }).toThrow();

    expect(() => {
      new JustValidate(document.querySelector('ddd')!, {
        testingMode: true,
      });
    }).toThrow();

    expect(() => {
      // @ts-ignore
      new JustValidate(123, {
        testingMode: true,
      });
    }).toThrow();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation.onSuccess(onSubmit);

    expect(() =>
      // @ts-ignore
      validation.addField(123, [
        {
          rule: 'required' as Rules,
        },
      ])
    ).toThrow();
    expect(() =>
      validation.addField('sdfsdf', [
        {
          rule: 'required' as Rules,
        },
      ])
    ).toThrow();
    expect(() => validation.addField('#name', [])).toThrow();
    expect(() =>
      validation.addField('#name', [
        {
          errorMessage: 'sdfdsf',
        },
      ])
    ).toThrow();
    expect(() =>
      validation.addField('#name', [
        {
          // @ts-ignore
          rule: 'NULL',
        },
      ])
    ).toThrow();
    expect(() => validation.addField('#name', [{}])).toThrow();
    expect(() => {
      validation.addField('#name', [
        {
          validator: undefined,
        },
      ]);
    }).toThrow();
    validation.addField('#name', [
      {
        // @ts-ignore
        validator: () => 1,
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

    onSubmit.mockReset();

    validation.addField('#name', [
      {
        rule: 'maxLength' as Rules,
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

    validation.addField('#name', [
      {
        rule: 'maxLength' as Rules,
        value: 'dd',
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

    validation.addField('#name', [
      {
        rule: 'minLength' as Rules,
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

    validation.addField('#name', [
      {
        rule: 'minLength' as Rules,
        value: 'dd',
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

    validation.addField('#name', [
      {
        rule: 'maxNumber' as Rules,
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

    validation.addField('#name', [
      {
        rule: 'maxNumber' as Rules,
        value: 'dd',
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

    validation.addField('#name', [
      {
        rule: 'minNumber' as Rules,
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

    validation.addField('#name', [
      {
        rule: 'minNumber' as Rules,
        value: 'dd',
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

    validation.addField('#name', [
      {
        rule: 'customRegexp' as Rules,
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

    changeTextBySelector('#name', 'text');
    validation.addField('#name', [
      {
        rule: 'customRegexp' as Rules,
        value: 'dfsdfsdf',
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
    changeTextBySelector('#name', '');

    validation.addField('#name', [
      {
        // @ts-ignore
        validator: '123123',
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

    validation.addField('#name', [
      {
        // @ts-ignore
        validator: () => {
          return () => true;
        },
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();

    validation.addField('#name', [
      {
        rule: 'required' as Rules,
      },
    ]);

    expect(() => {
      // @ts-ignore
      validation.removeField(123);
    }).toThrow();

    validation.removeField('dfdfdf');
    expect(console.error).toHaveBeenCalled();

    // @ts-ignore
    console.error.mockRestore();

    changeTextBySelector('#name', '123');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeNull();
    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();
    expect(console.error).not.toHaveBeenCalled();

    validation.addField('#files', [
      {
        rule: 'minFilesCount' as Rules,
      },
      {
        rule: 'maxFilesCount' as Rules,
      },
    ]);

    const input = screen.getByLabelText(
      /Upload your files/i
    ) as HTMLInputElement;
    userEvent.upload(
      input,
      new File(generateFileContent(10), 'file.png', { type: 'image/png' })
    );

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#files')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
    expect(console.error).toHaveBeenCalled();

    validation.addField('#files', [
      {
        rule: 'files' as Rules,
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#files')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
    expect(console.error).toHaveBeenCalled();

    validation.addField('#files', [
      {
        rule: 'files' as Rules,
        value: {},
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#files')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
    expect(console.error).toHaveBeenCalled();
  });

  test('should validate all fields and groups by basic rule', async () => {
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

    clickBySelector('#submit-btn');
    expect(getElem('button')).toBeDisabled();

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
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

  test('should be able submit form if validation passed', async () => {
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

    changeTextBySelector('#name', 'Georgii');
    changeTextBySelector('#email', 'test@test.com');
    changeTextBySelector('#password', '1234');
    changeTextBySelector('#message', 'Hi');
    clickBySelector('#consent_checkbox');
    clickBySelector('#read_terms_checkbox_group_1');
    clickBySelector('#communication_radio_group_1');
    selectBySelector('#favorite_animal_select', 'dog');

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
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

  test('should be able to show custom error messages', async () => {
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

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'Name is required'
    );
    expect(getElemByTestId('error-label-#consent_checkbox')).toHaveTextContent(
      'Consent checkbox is required'
    );
    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).toHaveTextContent('At least one term is required');
    expect(
      getElemByTestId('error-label-#communication_radio_group')
    ).toHaveTextContent('Communication channel is required');
    expect(
      getElemByTestId('error-label-#favorite_animal_select')
    ).toHaveTextContent('Animal select is required');
  });

  test('should be able to show conditional custom error messages', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          validator: (val) => {
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
          errorMessage: (val) => {
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

    changeTextBySelector('#name', 'Z');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'You cannot use Z/X/C as names'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    changeTextBySelector('#name', 'X');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'You cannot use Z/X/C as names'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    changeTextBySelector('#name', 'C');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'You cannot use Z/X/C as names'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    changeTextBySelector('#name', '.');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'Name is invalid'
    );
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    changeTextBySelector('#name', '123123123');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();
  });

  test('should be able to validate by different rules', async () => {
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

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
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

    changeTextBySelector('#name', 'Ge');
    changeTextBySelector('#email', 'testtest.com');
    changeTextBySelector('#password', 'qqq');

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
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

    changeTextBySelector('#name', 'Geooooooooooooooooooo');
    changeTextBySelector('#email', 'test@testcom');
    changeTextBySelector('#password', '1234d');

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
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

    changeTextBySelector('#name', 'Geooooooooo');
    changeTextBySelector('#email', 'test@test.com');
    changeTextBySelector('#password', '1234');

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(getElemByTestId('error-label-#name')).toBeNull();
    expect(getElemByTestId('error-label-#email')).toBeNull();
    expect(getElemByTestId('error-label-#password')).toBeNull();
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  test('should be able to validate by custom sync rule', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          validator: (value) => value[0] === '!',
        },
      ])
      .onSuccess(onSubmit);

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'Value is incorrect'
    );

    changeTextBySelector('#name', 'Georgii');

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'Value is incorrect'
    );

    changeTextBySelector('#name', '!Georgii');

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);

    expect(getElemByTestId('error-label-#name')).toBeNull();
  });

  test('should be able to validate by custom async rule', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          validator: (value) => () =>
            fetch(100, () => {
              return !!value;
            }),
        },
      ])
      .onSuccess(onSubmit);

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'Value is incorrect'
    );

    changeTextBySelector('#name', 'Georgii');

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalledTimes(1);

    expect(getElemByTestId('error-label-#name')).toBeNull();
  });

  test('should be able to validate numbers', async () => {
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
          rule: 'minNumber' as Rules,
          value: 10,
        },
        {
          rule: 'maxNumber' as Rules,
          value: 100,
        },
      ])
      .onSuccess(onSubmit);

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'The field is required'
    );

    changeTextBySelector('#name', '4');

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'Number should be more or equal than 10'
    );

    changeTextBySelector('#name', '122');

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'Number should be less or equal than 100'
    );

    changeTextBySelector('#name', '50');

    expect(getElem('button')).toBeEnabled();

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(getElemByTestId('error-label-#name')).toBeNull();

    onSubmit.mockReset();

    validation
      .addField('#name', [
        {
          rule: 'minNumber' as Rules,
          value: 0,
        },
        {
          rule: 'maxNumber' as Rules,
          value: 100,
        },
      ])
      .onSuccess(onSubmit);

    changeTextBySelector('#name', '0');

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();
  });

  test('should be able to validate password', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#password', [
        {
          rule: 'password' as Rules,
        },
      ])
      .onSuccess(onSubmit);

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#password')).not.toBeInTheDocument();

    changeTextBySelector('#password', '12345678');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(getElemByTestId('error-label-#password')).toHaveTextContent(
      'Password must contain minimum eight characters, at least one letter and one number'
    );

    changeTextBySelector('#password', '123456d');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(getElemByTestId('error-label-#password')).toHaveTextContent(
      'Password must contain minimum eight characters, at least one letter and one number'
    );

    changeTextBySelector('#password', '12345678a');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(onSubmit).toHaveBeenCalled();
    expect(getElemByTestId('error-label-#password')).toBeNull();
  });

  test('should be able to validate strong password', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#password', [
        {
          rule: 'strongPassword' as Rules,
        },
      ])
      .onSuccess(onSubmit);

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#password')).not.toBeInTheDocument();

    changeTextBySelector('#password', '12345678a');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(getElemByTestId('error-label-#password')).toHaveTextContent(
      'Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    );

    changeTextBySelector('#password', '12345678a!');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(getElemByTestId('error-label-#password')).toHaveTextContent(
      'Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    );

    changeTextBySelector('#password', '12345678a!A');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#password')).toBeNull();
    expect(onSubmit).toHaveBeenCalled();
  });

  test('should be able to validate custom regexps', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          rule: 'customRegexp' as Rules,
          value: /^[A-Z]+$/,
        },
      ])
      .onSuccess(onSubmit);

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();
    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();

    changeTextBySelector('#name', 'asgda');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();

    changeTextBySelector('#name', '123123sdf');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();

    changeTextBySelector('#name', '123123sAA');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();

    changeTextBySelector('#name', 'AAAA');
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    expect(getElemByTestId('error-label-#name')).toBeNull();

    onSubmit.mockReset();
    validation.addField('#name', [
      {
        rule: 'required' as Rules,
      },
      {
        rule: 'customRegexp' as Rules,
        value: /^[A-Z]+$/,
      },
    ]);

    changeTextBySelector('#name', '');

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
  });

  test('should be able to change language', async () => {
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

    clickBySelector('#submit-btn');
    expect(getElem('button')).toBeDisabled();

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'Name is invalid'
    );

    // @ts-ignore
    validation.setCurrentLocale(123);

    expect(console.error).toHaveBeenCalled();

    validation.setCurrentLocale('ru');

    await waitFor(() => {
      expect(getElemByTestId('error-label-#name')).toHaveTextContent(
        'Имя некорректно'
      );
    });

    validation.setCurrentLocale();
    await waitFor(() => {
      expect(getElemByTestId('error-label-#name')).toHaveTextContent(
        'Name is invalid'
      );
    });

    validation.setCurrentLocale('en');

    await waitFor(() => {
      expect(getElemByTestId('error-label-#name')).toHaveTextContent(
        'Name is invalid'
      );
    });

    validation.setCurrentLocale('qq');

    await waitFor(() => {
      expect(getElemByTestId('error-label-#name')).toHaveTextContent(
        'Name is invalid'
      );
    });
  });

  test('should be able to render tooltips', async () => {
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

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
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

  test('should be able to remove field', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#name', [
        {
          rule: 'required' as Rules,
        },
      ])
      .onSuccess(onSubmit);

    clickBySelector('#submit-btn');
    expect(getElem('button')).toBeDisabled();

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();

    validation.removeField('#name');

    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();

    clickBySelector('#submit-btn');
    expect(getElem('button')).toBeDisabled();

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
  });

  test('should be able validate uploaded files count', async () => {
    const onSubmit = jest.fn();

    const file = new File(['file'], 'file.png', { type: 'image/png' });

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#files', [
        {
          rule: 'minFilesCount' as Rules,
          value: 1,
        },
        {
          rule: 'maxFilesCount' as Rules,
          value: 3,
        },
      ])
      .onSuccess(onSubmit);

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#files')).toHaveTextContent(
      'Files count should be more or equal than 1'
    );

    const input = screen.getByLabelText(
      /Upload your files/i
    ) as HTMLInputElement;
    userEvent.upload(input, [file, file, file, file]);

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#files')).toHaveTextContent(
      'Files count should be less or equal than 3'
    );

    userEvent.upload(input, [file, file, file]);

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();
    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(input, [file]);

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();
    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();
  });

  test('should be able validate files types and extensions', async () => {
    const onSubmit = jest.fn();

    const filePng = new File(['file'], 'file.png', { type: 'image/png' });
    const fileJpeg = new File(['file'], 'file.jpeg', { type: 'image/jpeg' });
    const fileTxt = new File(['file'], 'file.txt', { type: 'text/plain' });

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#files', [
        {
          rule: 'files' as Rules,
          value: {
            files: {
              types: ['image/png', 'image/jpeg'],
              extensions: ['png', 'jpeg'],
            },
          },
        },
      ])
      .onSuccess(onSubmit);

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    const input = screen.getByLabelText(
      /Upload your files/i
    ) as HTMLInputElement;
    userEvent.upload(input, [filePng]);

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(input, [fileJpeg]);

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(input, [fileJpeg, filePng]);

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(input, [fileJpeg, filePng, fileTxt]);

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).toHaveTextContent(
      'Uploaded files have one or several invalid properties (extension/size/type etc)'
    );

    userEvent.upload(input, [fileTxt]);

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).toHaveTextContent(
      'Uploaded files have one or several invalid properties (extension/size/type etc)'
    );
  });

  test('should be able validate files sizes', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#files', [
        {
          rule: 'files' as Rules,
          value: {
            files: {
              minSize: 1000,
              maxSize: 2000,
            },
          },
        },
      ])
      .onSuccess(onSubmit);

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    const input = screen.getByLabelText(
      /Upload your files/i
    ) as HTMLInputElement;
    userEvent.upload(
      input,
      new File(generateFileContent(10), 'file.png', { type: 'image/png' })
    );

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).toHaveTextContent(
      'Uploaded files have one or several invalid properties (extension/size/type etc)'
    );

    userEvent.upload(
      input,
      new File(generateFileContent(999), 'file.png', { type: 'image/png' })
    );

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).toHaveTextContent(
      'Uploaded files have one or several invalid properties (extension/size/type etc)'
    );

    userEvent.upload(
      input,
      new File(generateFileContent(1000), 'file.png', { type: 'image/png' })
    );

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(
      input,
      new File(generateFileContent(1001), 'file.png', { type: 'image/png' })
    );

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(
      input,
      new File(generateFileContent(2000), 'file.png', { type: 'image/png' })
    );

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(
      input,
      new File(generateFileContent(2001), 'file.png', { type: 'image/png' })
    );

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).toHaveTextContent(
      'Uploaded files have one or several invalid properties (extension/size/type etc)'
    );
  });

  test('should be able validate files names', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addField('#files', [
        {
          rule: 'files' as Rules,
          value: {
            files: {
              names: ['file.txt'],
            },
          },
        },
      ])
      .onSuccess(onSubmit);

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    const input = screen.getByLabelText(
      /Upload your files/i
    ) as HTMLInputElement;
    userEvent.upload(
      input,
      new File(generateFileContent(10), 'file.png', { type: 'image/png' })
    );

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).toHaveTextContent(
      'Uploaded files have one or several invalid properties (extension/size/type etc)'
    );

    userEvent.upload(input, [
      new File(generateFileContent(10), 'file.png', { type: 'image/png' }),
      new File(generateFileContent(10), 'file.txt', { type: 'image/png' }),
    ]);

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).toHaveTextContent(
      'Uploaded files have one or several invalid properties (extension/size/type etc)'
    );

    userEvent.upload(input, [
      new File(generateFileContent(10), 'file.txt', { type: 'image/png' }),
    ]);

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(input, [
      new File(generateFileContent(10), 'file.txt', { type: 'image/png' }),
      new File(generateFileContent(10), 'file.txt', { type: 'image/png' }),
    ]);

    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();
  });

  test('should be able to show success labels', async () => {
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

    changeTextBySelector('#name', 'Georgii');
    changeTextBySelector('#email', '123');

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();
    expect(getElemByTestId('success-label-#name')).toHaveTextContent(
      'Name looks good'
    );
    expect(getElemByTestId('success-label-#email')).not.toBeInTheDocument();
    expect(getElemByTestId('error-label-#email')).toHaveTextContent(
      'Email is invalid'
    );
    expect(
      getElemByTestId('success-label-#read_terms_checkbox_group')
    ).not.toBeInTheDocument();
    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).toHaveTextContent('Group is invalid');

    clickBySelector('#read_terms_checkbox_group_1');
    changeTextBySelector('#email', 'test@test.com');

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();

    expect(getElemByTestId('error-label-#email')).not.toBeInTheDocument();
    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();
    expect(getElemByTestId('success-label-#email')).toHaveTextContent(
      'Email looks good'
    );
    expect(getElemByTestId('success-label-#name')).toHaveTextContent(
      'Name looks good'
    );
    expect(
      getElemByTestId('success-label-#read_terms_checkbox_group')
    ).toHaveTextContent('Group looks good');
    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).not.toBeInTheDocument();
  });
});
