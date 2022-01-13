import JustValidate from '../main';
import { Rules } from '../modules/interfaces';
import {
  changeTextBySelector,
  clickBySelector,
  generateFileContent,
  getElem,
  getElemByTestId,
} from '../utils/testingUtils';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('invalidConfiguration', () => {
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
    expect(() => {
      // @ts-ignore
      validation.addRequiredGroup(123);
    }).toThrow();
    expect(() => {
      // @ts-ignore
      validation.addRequiredGroup('123');
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
    // @ts-ignore
    console.error.mockReset();

    validation.addField('#name', [
      {
        rule: 'customRegexp' as Rules,
        value: '123ds[[/',
      },
    ]);
    clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('button')).toBeEnabled();
    });
    expect(getElemByTestId('error-label-#name')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();
    expect(console.error).toHaveBeenCalled();

    validation.addField('#files', [
      {
        rule: 'maxFilesCount' as Rules,
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
    // @ts-ignore
    console.error.mockReset();

    validation.addField('#files', [
      {
        rule: 'minFilesCount' as Rules,
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
    // @ts-ignore
    console.error.mockReset();

    validation.addField('#files', [
      {
        rule: 'files' as Rules,
        value: 123,
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
    // @ts-ignore
    console.error.mockReset();
  });
});
