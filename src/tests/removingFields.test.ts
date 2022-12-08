import JustValidate, { Rules } from '../main';
import {
  changeTextBySelector,
  clickBySelector,
  getElem,
  getElemByTestId,
} from '../utils/testingUtils';
import { waitFor } from '@testing-library/dom';

describe('removingFields', () => {
  it('should be able to remove field', async () => {
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

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();

    validation.removeField('#name');

    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
  });

  it('should be able to remove group', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addRequiredGroup('#read_terms_checkbox_group')
      .onSuccess(onSubmit);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).toBeInTheDocument();

    validation.removeGroup('#read_terms_checkbox_group');

    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).not.toBeInTheDocument();

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
  });

  it('should be able to remove multiple fields', async () => {
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
      .onSuccess(onSubmit);

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(getElemByTestId('error-label-#email')).toBeInTheDocument();
    expect(getElemByTestId('error-label-#password')).toBeInTheDocument();

    validation.removeField('#name');
    validation.removeField('#email');

    expect(console.error).not.toHaveBeenCalled();
    // @ts-ignore
    console.error.mockReset();

    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();
    expect(getElemByTestId('error-label-#email')).not.toBeInTheDocument();
    expect(getElemByTestId('error-label-#password')).not.toBeInTheDocument();

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByTestId('error-label-#name')).not.toBeInTheDocument();
    expect(getElemByTestId('error-label-#email')).not.toBeInTheDocument();
    expect(getElemByTestId('error-label-#password')).toBeInTheDocument();
  });

  it('should be able to remove multiple groups', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addRequiredGroup('#read_terms_checkbox_group')
      .addRequiredGroup('#communication_radio_group')
      .onSuccess(onSubmit);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).toBeInTheDocument();
    expect(
      getElemByTestId('error-label-#communication_radio_group')
    ).toBeInTheDocument();

    validation.removeGroup('#read_terms_checkbox_group');
    validation.removeGroup('#communication_radio_group');

    expect(console.error).not.toHaveBeenCalled();
    // @ts-ignore
    console.error.mockReset();

    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).not.toBeInTheDocument();
    expect(
      getElemByTestId('error-label-#communication_radio_group')
    ).not.toBeInTheDocument();

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).not.toBeInTheDocument();
    expect(
      getElemByTestId('error-label-#communication_radio_group')
    ).not.toBeInTheDocument();
  });

  it('should be able to remove multiple fields if fields were removed from DOM and add it back', async () => {
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
      .onSuccess(onSubmit);

    const nameHTML = document.querySelector('#name')!.outerHTML;
    document.querySelector('#name')!.remove();
    const emailHTML = document.querySelector('#email')!.outerHTML;
    document.querySelector('#email')!.remove();

    validation.removeField('#name');
    validation.removeField('#email');

    expect(console.error).not.toHaveBeenCalled();
    // @ts-ignore
    console.error.mockReset();

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    await changeTextBySelector('#password', '123');

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByTestId('error-label-#password')).not.toBeInTheDocument();
    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    const form = document.querySelector('#form') as HTMLFormElement;

    form.innerHTML += nameHTML;
    form.innerHTML += emailHTML;

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
      ]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(getElemByTestId('error-label-#email')).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
  });

  it('should be able to remove multiple groups if they were removed from DOM and add it back', async () => {
    const onSubmit = jest.fn();

    const validation = new JustValidate('#form', {
      testingMode: true,
    });

    validation
      .addRequiredGroup('#read_terms_checkbox_group')
      .addRequiredGroup('#communication_radio_group')
      .onSuccess(onSubmit);

    const group1HTML = document.querySelector(
      '#read_terms_checkbox_group'
    )!.outerHTML;
    document.querySelector('#read_terms_checkbox_group')!.remove();
    const group2HTML = document.querySelector(
      '#communication_radio_group'
    )!.outerHTML;
    document.querySelector('#communication_radio_group')!.remove();

    validation.removeGroup('#read_terms_checkbox_group');
    validation.removeGroup('#communication_radio_group');

    expect(console.error).not.toHaveBeenCalled();
    // @ts-ignore
    console.error.mockReset();

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    const form = document.querySelector('#form') as HTMLFormElement;

    form.innerHTML += group1HTML;
    form.innerHTML += group2HTML;

    validation
      .addRequiredGroup('#read_terms_checkbox_group')
      .addRequiredGroup('#communication_radio_group');

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(
      getElemByTestId('error-label-#read_terms_checkbox_group')
    ).toBeInTheDocument();
    expect(
      getElemByTestId('error-label-#communication_radio_group')
    ).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
  });
});
