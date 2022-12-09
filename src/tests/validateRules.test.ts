import JustValidate, { Rules } from '../main';
import {
  changeTextBySelector,
  clickBySelector,
  getElem,
  getElemByKey,
} from '../utils/testingUtils';
import { waitFor } from '@testing-library/dom';

describe('validateRules', () => {
  it('should be able to validate numbers', async () => {
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

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByKey('error-label', '#name', validation)).toHaveTextContent(
      'The field is required'
    );

    await changeTextBySelector('#name', '4');

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByKey('error-label', '#name', validation)).toHaveTextContent(
      'Number should be more or equal than 10'
    );

    await changeTextBySelector('#name', '122');

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByKey('error-label', '#name', validation)).toHaveTextContent(
      'Number should be less or equal than 100'
    );

    await changeTextBySelector('#name', '50');

    expect(getElem('#submit-btn')).toBeEnabled();

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(getElemByKey('error-label', '#name', validation)).toBeNull();

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

    await changeTextBySelector('#name', '0');

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();

    expect(
      getElemByKey('error-label', '#name', validation)
    ).not.toBeInTheDocument();
  });

  it('should be able to validate password', async () => {
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

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(
      getElemByKey('error-label', '#password', validation)
    ).not.toBeInTheDocument();

    await changeTextBySelector('#password', '12345678');
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      getElemByKey('error-label', '#password', validation)
    ).toHaveTextContent(
      'Password must contain minimum eight characters, at least one letter and one number'
    );

    await changeTextBySelector('#password', '123456d');
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      getElemByKey('error-label', '#password', validation)
    ).toHaveTextContent(
      'Password must contain minimum eight characters, at least one letter and one number'
    );

    await changeTextBySelector('#password', '12345678a');
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(onSubmit).toHaveBeenCalled();
    expect(getElemByKey('error-label', '#password', validation)).toBeNull();
  });

  it('should be able to validate strong password', async () => {
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

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(
      getElemByKey('error-label', '#password', validation)
    ).not.toBeInTheDocument();

    await changeTextBySelector('#password', '12345678a');
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      getElemByKey('error-label', '#password', validation)
    ).toHaveTextContent(
      'Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    );

    await changeTextBySelector('#password', '12345678a!');
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    expect(
      getElemByKey('error-label', '#password', validation)
    ).toHaveTextContent(
      'Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character'
    );

    await changeTextBySelector('#password', '12345678a!A');
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(getElemByKey('error-label', '#password', validation)).toBeNull();
    expect(onSubmit).toHaveBeenCalled();
  });

  it('should be able to validate custom regexps', async () => {
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

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();
    expect(
      getElemByKey('error-label', '#name', validation)
    ).not.toBeInTheDocument();

    await changeTextBySelector('#name', 'asgda');
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
    expect(
      getElemByKey('error-label', '#name', validation)
    ).toBeInTheDocument();

    await changeTextBySelector('#name', '123123sdf');
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
    expect(
      getElemByKey('error-label', '#name', validation)
    ).toBeInTheDocument();

    await changeTextBySelector('#name', '123123sAA');
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
    expect(
      getElemByKey('error-label', '#name', validation)
    ).toBeInTheDocument();

    await changeTextBySelector('#name', 'AAAA');
    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });
    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });
    expect(getElemByKey('error-label', '#name', validation)).toBeNull();

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

    await changeTextBySelector('#name', '');

    await clickBySelector('#submit-btn');

    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
    expect(
      getElemByKey('error-label', '#name', validation)
    ).toBeInTheDocument();
  });
});
