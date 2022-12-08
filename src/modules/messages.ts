import { Rules } from './interfaces';

export const defaultDictionary = [
  {
    key: Rules.Required,
    dict: {
      en: 'The field is required',
    },
  },
  {
    key: Rules.Email,
    dict: {
      en: 'Email has invalid format',
    },
  },
  {
    key: Rules.MaxLength,
    dict: {
      en: 'The field must contain a maximum of :value characters',
    },
  },
  {
    key: Rules.MinLength,
    dict: {
      en: 'The field must contain a minimum of :value characters',
    },
  },
  {
    key: Rules.Password,
    dict: {
      en: 'Password must contain minimum eight characters, at least one letter and one number',
    },
  },
  {
    key: Rules.StrongPassword,
    dict: {
      en: 'Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  },
  {
    key: Rules.Number,
    dict: {
      en: 'Value should be a number',
    },
  },
  {
    key: Rules.MaxNumber,
    dict: {
      en: 'Number should be less or equal than :value',
    },
  },
  {
    key: Rules.MinNumber,
    dict: {
      en: 'Number should be more or equal than :value',
    },
  },
  {
    key: Rules.MinFilesCount,
    dict: {
      en: 'Files count should be more or equal than :value',
    },
  },
  {
    key: Rules.MaxFilesCount,
    dict: {
      en: 'Files count should be less or equal than :value',
    },
  },
  {
    key: Rules.Files,
    dict: {
      en: 'Uploaded files have one or several invalid properties (extension/size/type etc).',
    },
  },
];

export const DEFAULT_ERROR_FIELD_MESSAGE = 'Value is incorrect';
