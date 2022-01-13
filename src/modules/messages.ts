import { FieldRuleValueType, GroupRules, Rules } from './interfaces';

export const getDefaultFieldMessage = (
  rule?: Rules,
  ruleValue?: FieldRuleValueType
): string => {
  switch (rule) {
    case Rules.Required:
      return 'The field is required';

    case Rules.Email:
      return 'Email has invalid format';

    case Rules.MaxLength:
      return 'The field must contain a maximum of :value characters'.replace(
        ':value',
        String(ruleValue!)
      );

    case Rules.MinLength:
      return 'The field must contain a minimum of :value characters'.replace(
        ':value',
        String(ruleValue!)
      );

    case Rules.Password:
      return 'Password must contain minimum eight characters, at least one letter and one number';

    case Rules.Number:
      return 'Value should be a number';

    case Rules.StrongPassword:
      return 'Password should contain minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character';

    case Rules.MaxNumber:
      return 'Number should be less or equal than :value'.replace(
        ':value',
        String(ruleValue!)
      );

    case Rules.MinNumber:
      return 'Number should be more or equal than :value'.replace(
        ':value',
        String(ruleValue!)
      );

    case Rules.MinFilesCount:
      return 'Files count should be more or equal than :value'.replace(
        ':value',
        String(ruleValue!)
      );

    case Rules.MaxFilesCount:
      return 'Files count should be less or equal than :value'.replace(
        ':value',
        String(ruleValue!)
      );

    case Rules.Files:
      return 'Uploaded files have one or several invalid properties (extension/size/type etc)';

    default:
      return 'Value is incorrect';
  }
};

export const getDefaultGroupMessage = (rule?: GroupRules): string => {
  switch (rule) {
    case GroupRules.Required:
      return 'The field is required';

    default:
      return 'Group is incorrect';
  }
};
