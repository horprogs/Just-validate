import JustValidate, { Rules } from '../main';
import {
  changeTextBySelector,
  clickBySelector,
  getElem,
  getElemByKey,
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

    expect(
      getElemByKey('error-label', '#name', validation)
    ).toBeInTheDocument();

    validation.removeField('#name');

    expect(
      getElemByKey('error-label', '#name', validation)
    ).not.toBeInTheDocument();

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
      getElemByKey('error-label', '#read_terms_checkbox_group', validation)
    ).toBeInTheDocument();

    validation.removeGroup('#read_terms_checkbox_group');

    expect(
      getElemByKey('error-label', '#read_terms_checkbox_group', validation)
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

    expect(
      getElemByKey('error-label', '#name', validation)
    ).toBeInTheDocument();
    expect(
      getElemByKey('error-label', '#email', validation)
    ).toBeInTheDocument();
    expect(
      getElemByKey('error-label', '#password', validation)
    ).toBeInTheDocument();

    validation.removeField('#name');
    validation.removeField('#email');

    expect(console.error).not.toHaveBeenCalled();
    // @ts-ignore
    console.error.mockReset();

    expect(
      getElemByKey('error-label', '#name', validation)
    ).not.toBeInTheDocument();
    expect(
      getElemByKey('error-label', '#email', validation)
    ).not.toBeInTheDocument();
    expect(
      getElemByKey('error-label', '#password', validation)
    ).not.toBeInTheDocument();

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(
      getElemByKey('error-label', '#name', validation)
    ).not.toBeInTheDocument();
    expect(
      getElemByKey('error-label', '#email', validation)
    ).not.toBeInTheDocument();
    expect(
      getElemByKey('error-label', '#password', validation)
    ).toBeInTheDocument();
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
      getElemByKey('error-label', '#read_terms_checkbox_group', validation)
    ).toBeInTheDocument();
    expect(
      getElemByKey('error-label', '#communication_radio_group', validation)
    ).toBeInTheDocument();

    validation.removeGroup('#read_terms_checkbox_group');
    validation.removeGroup('#communication_radio_group');

    expect(console.error).not.toHaveBeenCalled();
    // @ts-ignore
    console.error.mockReset();

    expect(
      getElemByKey('error-label', '#read_terms_checkbox_group', validation)
    ).not.toBeInTheDocument();
    expect(
      getElemByKey('error-label', '#communication_radio_group', validation)
    ).not.toBeInTheDocument();

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(
      getElemByKey('error-label', '#read_terms_checkbox_group', validation)
    ).not.toBeInTheDocument();
    expect(
      getElemByKey('error-label', '#communication_radio_group', validation)
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

    expect(
      getElemByKey('error-label', '#password', validation)
    ).not.toBeInTheDocument();
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

    expect(
      getElemByKey('error-label', '#name', validation)
    ).toBeInTheDocument();
    expect(
      getElemByKey('error-label', '#email', validation)
    ).toBeInTheDocument();

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
      getElemByKey('error-label', '#read_terms_checkbox_group', validation)
    ).toBeInTheDocument();
    expect(
      getElemByKey('error-label', '#communication_radio_group', validation)
    ).toBeInTheDocument();

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
  });
});
