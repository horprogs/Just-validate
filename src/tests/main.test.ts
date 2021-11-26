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
import { waitFor } from '@testing-library/dom';

describe('Validation', () => {
  beforeEach(() => {
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

      <button class='btn btn-primary' id="submit-btn">Submit</button>
`;
  });
  test('should throw errors if setting invalid', async () => {
    console.warn = jest.fn();
    console.error = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

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

    expect(console.error).toHaveBeenCalled();
  });

  test('should validate all fields and groups by basic rule', async () => {
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
      .onSuccess(onSubmit);

    clickBySelector('#submit-btn');
    expect(getElem('button')).toBeDisabled();

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

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
      .onSuccess(onSubmit);

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
      'Number should be more than 10'
    );

    changeTextBySelector('#name', '122');

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toHaveTextContent(
      'Number should be less than 100'
    );

    changeTextBySelector('#name', '50');

    expect(getElem('button')).toBeEnabled();

    clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(getElemByTestId('error-label-#name')).toBeNull();
  });
});
