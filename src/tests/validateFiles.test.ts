import JustValidate, { Rules } from '../main';
import {
  clickBySelector,
  generateFileContent,
  getElem,
  getElemByTestId,
} from '../utils/testingUtils';
import { screen, waitFor } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

describe('validateFiles', () => {
  it('should be able validate uploaded files count', async () => {
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

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#files')).toHaveTextContent(
      'Files count should be more or equal than 1'
    );

    const input = screen.getByLabelText(
      /Upload your files/i
    ) as HTMLInputElement;
    userEvent.upload(input, [file, file, file, file]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();

    expect(getElemByTestId('error-label-#files')).toHaveTextContent(
      'Files count should be less or equal than 3'
    );

    userEvent.upload(input, [file, file, file]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();
    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(input, [file]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();
    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();
  });

  it('should be able validate files types and extensions', async () => {
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

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    const input = screen.getByLabelText(
      /Upload your files/i
    ) as HTMLInputElement;
    userEvent.upload(input, [filePng]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(input, [fileJpeg]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(input, [fileJpeg, filePng]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(input, [fileJpeg, filePng, fileTxt]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).toHaveTextContent(
      'Uploaded files have one or several invalid properties (extension/size/type etc)'
    );

    userEvent.upload(input, [fileTxt]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).toHaveTextContent(
      'Uploaded files have one or several invalid properties (extension/size/type etc)'
    );
  });

  it('should be able validate files sizes', async () => {
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

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
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

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
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

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
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

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(
      input,
      new File(generateFileContent(1001), 'file.png', { type: 'image/png' })
    );

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(
      input,
      new File(generateFileContent(2000), 'file.png', { type: 'image/png' })
    );

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(
      input,
      new File(generateFileContent(2001), 'file.png', { type: 'image/png' })
    );

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).toHaveTextContent(
      'Uploaded files have one or several invalid properties (extension/size/type etc)'
    );
  });

  it('should be able validate files names', async () => {
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

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
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

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
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

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).toHaveTextContent(
      'Uploaded files have one or several invalid properties (extension/size/type etc)'
    );

    userEvent.upload(input, [
      new File(generateFileContent(10), 'file.txt', { type: 'image/png' }),
    ]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();

    userEvent.upload(input, [
      new File(generateFileContent(10), 'file.txt', { type: 'image/png' }),
      new File(generateFileContent(10), 'file.txt', { type: 'image/png' }),
    ]);

    await clickBySelector('#submit-btn');
    await waitFor(() => {
      expect(getElem('#submit-btn')).toBeEnabled();
    });

    expect(onSubmit).toHaveBeenCalled();
    onSubmit.mockReset();

    expect(getElemByTestId('error-label-#files')).not.toBeInTheDocument();
  });
});
