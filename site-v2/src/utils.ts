import {GlobalConfigInterface} from "just-validate";

export const defaultJustValidateConfig: Partial<GlobalConfigInterface> = {
  errorFieldCssClass: 'invalid',
  successFieldCssClass: 'valid',
  errorLabelCssClass: 'label-invalid',
  focusInvalidField: true,
  lockForm: true,
};
