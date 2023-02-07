import JustValidate from '../main';
import { Rules } from '../modules/interfaces';
import { changeTextBySelector, clickBySelector } from '../utils/testingUtils';
import { mockup } from './mockup';

describe('methods', () => {
  beforeEach(() => {
    console.warn = jest.fn();
    console.error = jest.fn();

    document.body.innerHTML = mockup;
  });
  it('should trigger onValidate on every change with validateBeforeSubmitting', async () => {
    const validation = new JustValidate('#form', {
      testingMode: true,
      validateBeforeSubmitting: true,
    });
    const onValidate = jest.fn();

    validation
      .addField('#name', [
        {
          rule: Rules.Required,
        },
      ])
      .addField(document.querySelector('#email') as HTMLInputElement, [
        {
          rule: Rules.Required,
        },
      ])
      .onValidate(onValidate);

    await changeTextBySelector('#name', '1');

    expect(onValidate).toHaveBeenCalledTimes(1);
    expect(onValidate).toHaveBeenCalledWith(
      expect.objectContaining({
        isValid: false,
        isSubmitted: false,
      })
    );
    onValidate.mockReset();

    await changeTextBySelector('#email', '1');

    expect(onValidate).toHaveBeenCalledTimes(1);
    expect(onValidate).toHaveBeenCalledWith(
      expect.objectContaining({
        isValid: true,
        isSubmitted: false,
      })
    );
    onValidate.mockReset();

    await changeTextBySelector('#email', '');
    expect(onValidate).toHaveBeenCalledTimes(1);
    onValidate.mockReset();

    await clickBySelector('#submit-btn');

    expect(onValidate).toHaveBeenCalledTimes(1);
    expect(onValidate).toHaveBeenCalledWith(
      expect.objectContaining({
        isValid: false,
        isSubmitted: true,
      })
    );

    onValidate.mockReset();

    await changeTextBySelector('#email', '1');

    expect(onValidate).toHaveBeenCalledTimes(1);
    expect(onValidate).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: {
          '#name': {
            config: undefined,
            elem: expect.anything(),
            errorMessage: 'The field is required',
            isValid: true,
            rules: [{ rule: 'required' }],
            touched: true,
          },
          '2': {
            config: undefined,
            elem: expect.anything(),
            errorMessage: 'The field is required',
            isValid: true,
            rules: [{ rule: 'required' }],
            touched: true,
          },
        },
        groups: {},
        isSubmitted: true,
        isValid: true,
      })
    );
    onValidate.mockReset();
  });

  it('should trigger onValidate on every change without validateBeforeSubmitting', async () => {
    const validation = new JustValidate('#form', {
      testingMode: true,
    });
    const onValidate = jest.fn();

    validation
      .addField('#name', [
        {
          rule: Rules.Required,
        },
      ])
      .addField(document.querySelector('#email') as HTMLInputElement, [
        {
          rule: Rules.Required,
        },
      ])
      .onValidate(onValidate);

    await changeTextBySelector('#name', '1');

    expect(onValidate).toHaveBeenCalledTimes(1);
    expect(onValidate).toHaveBeenCalledWith(
      expect.objectContaining({
        isValid: undefined,
        isSubmitted: false,
      })
    );
    onValidate.mockReset();

    await changeTextBySelector('#email', '1');

    expect(onValidate).toHaveBeenCalledTimes(1);
    expect(onValidate).toHaveBeenCalledWith(
      expect.objectContaining({
        isValid: true,
        isSubmitted: false,
      })
    );
    onValidate.mockReset();

    await clickBySelector('#submit-btn');

    expect(onValidate).toHaveBeenCalledTimes(1);
    expect(onValidate).toHaveBeenCalledWith(
      expect.objectContaining({
        isValid: true,
        isSubmitted: true,
      })
    );

    onValidate.mockReset();

    await changeTextBySelector('#name', '');

    expect(onValidate).toHaveBeenCalledTimes(1);
    expect(onValidate).toHaveBeenCalledWith(
      expect.objectContaining({
        isValid: false,
        isSubmitted: true,
      })
    );
    onValidate.mockReset();

    await changeTextBySelector('#name', '1');

    expect(onValidate).toHaveBeenCalledTimes(1);
    expect(onValidate).toHaveBeenCalledWith(
      expect.objectContaining({
        fields: {
          '#name': {
            config: undefined,
            elem: expect.anything(),
            errorMessage: 'The field is required',
            isValid: true,
            rules: [{ rule: 'required' }],
            touched: true,
          },
          '2': {
            config: undefined,
            elem: expect.anything(),
            isValid: true,
            rules: [{ rule: 'required' }],
            touched: true,
          },
        },
        groups: {},
        isSubmitted: true,
        isValid: true,
      })
    );
    onValidate.mockReset();
  });
});
