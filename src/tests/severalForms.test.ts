import JustValidate from '../main';
import { Rules } from '../modules/interfaces';
import {
  changeTextBySelector,
  clickBySelector,
  getElem,
  getElemByTestId,
} from '../utils/testingUtils';
import { waitFor } from '@testing-library/dom';
import { multipleFormsMockup } from './mockup';

describe('Several forms', () => {
  beforeEach(() => {
    console.warn = jest.fn();
    console.error = jest.fn();

    document.body.innerHTML = multipleFormsMockup;
  });

  test('should be able to validate 2 forms with the same fields', async () => {
    const onForm1Submit = jest.fn();
    const onForm2Submit = jest.fn();
    const onForm1Fail = jest.fn();
    const onForm2Fail = jest.fn();

    const successCallbacks = [onForm1Submit, onForm2Submit];
    const failCallbacks = [onForm1Fail, onForm2Fail];

    ['#form1', '#form2'].forEach((selector, i) => {
      const validation = new JustValidate(selector, {
        testingMode: true,
      });

      validation
        .addField('.name', [
          {
            rule: 'required' as Rules,
          },
        ])
        .addRequiredGroup('.read_terms_checkbox_group')
        .onSuccess(successCallbacks[i])
        .onFail(failCallbacks[i]);
    });

    await clickBySelector('#form1_submit-btn');
    await waitFor(() => {
      expect(getElem('#form1_submit-btn')).toBeEnabled();
    });

    expect(onForm1Submit).not.toHaveBeenCalled();
    expect(onForm2Submit).not.toHaveBeenCalled();
    expect(onForm1Fail).toHaveBeenCalled();
    expect(onForm2Fail).not.toHaveBeenCalled();
    onForm1Submit.mockReset();
    onForm2Submit.mockReset();
    onForm1Fail.mockReset();
    onForm2Fail.mockReset();

    const form1 = getElem('#form1') as HTMLFormElement;
    const form2 = getElem('#form2') as HTMLFormElement;

    expect(getElemByTestId('error-label-.name', form1)).toHaveTextContent(
      'The field is required'
    );
    expect(
      getElemByTestId('error-label-.read_terms_checkbox_group', form1)
    ).toHaveTextContent('The field is required');
    expect(getElemByTestId('error-label-.name', form2)).not.toBeInTheDocument();
    expect(
      getElemByTestId('error-label-.read_terms_checkbox_group', form2)
    ).not.toBeInTheDocument();

    await changeTextBySelector('#form1 .name', 'Georgii');
    await clickBySelector('#form1_read_terms_checkbox_group_1');

    await clickBySelector('#form1_submit-btn');
    await waitFor(() => {
      expect(getElem('#form1_submit-btn')).toBeEnabled();
    });

    expect(onForm1Submit).toHaveBeenCalled();
    expect(onForm2Submit).not.toHaveBeenCalled();
    expect(onForm1Fail).not.toHaveBeenCalled();
    expect(onForm2Fail).not.toHaveBeenCalled();
    onForm1Submit.mockReset();
    onForm2Submit.mockReset();
    onForm1Fail.mockReset();
    onForm2Fail.mockReset();

    expect(getElemByTestId('error-label-.name', form1)).not.toBeInTheDocument();
    expect(
      getElemByTestId('error-label-.read_terms_checkbox_group', form1)
    ).not.toBeInTheDocument();
    expect(getElemByTestId('error-label-.name', form2)).not.toBeInTheDocument();
    expect(
      getElemByTestId('error-label-.read_terms_checkbox_group', form2)
    ).not.toBeInTheDocument();

    await clickBySelector('#form2_submit-btn');
    await waitFor(() => {
      expect(getElem('#form2_submit-btn')).toBeEnabled();
    });

    expect(onForm1Submit).not.toHaveBeenCalled();
    expect(onForm2Submit).not.toHaveBeenCalled();
    expect(onForm1Fail).not.toHaveBeenCalled();
    expect(onForm2Fail).toHaveBeenCalled();
    onForm1Submit.mockReset();
    onForm2Submit.mockReset();
    onForm1Fail.mockReset();
    onForm2Fail.mockReset();

    expect(getElemByTestId('error-label-.name', form2)).toHaveTextContent(
      'The field is required'
    );
    expect(
      getElemByTestId('error-label-.read_terms_checkbox_group', form2)
    ).toHaveTextContent('The field is required');
    expect(getElemByTestId('error-label-.name', form1)).not.toBeInTheDocument();
    expect(
      getElemByTestId('error-label-.read_terms_checkbox_group', form1)
    ).not.toBeInTheDocument();

    await changeTextBySelector('#form2 .name', 'Georgii');
    await clickBySelector('#form2_read_terms_checkbox_group_1');

    await clickBySelector('#form2_submit-btn');
    await waitFor(() => {
      expect(getElem('#form2_submit-btn')).toBeEnabled();
    });

    expect(onForm1Submit).not.toHaveBeenCalled();
    expect(onForm2Submit).toHaveBeenCalled();
    expect(onForm1Fail).not.toHaveBeenCalled();
    expect(onForm2Fail).not.toHaveBeenCalled();
    onForm1Submit.mockReset();
    onForm2Submit.mockReset();
    onForm1Fail.mockReset();
    onForm2Fail.mockReset();
  });
});
