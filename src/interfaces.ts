export interface GlobalConfigInterface {
  errorFieldStyle: Partial<CSSStyleDeclaration>;
  errorFieldCssClass: string;
  errorLabelStyle: Partial<CSSStyleDeclaration>;
  errorLabelCssClass: string;
}

export enum Rules {
  Required = 'required',
  Email = 'email',
  MinLength = 'minLength',
  MaxLength = 'maxLength',
  Password = 'password',
  Number = 'number',
  MaxNumber = 'maxNumber',
  MinNumber = 'minNumber',
  StrongPassword = 'strongPassword',
  CustomRegexp = 'customRegexp',
}

export interface FieldRuleInterface {
  rule?: Rules;
  errorMessage?: string;
  validator?: (
    value: string,
    context: ContextInterface
  ) => boolean | Promise<boolean>;
  value?: number | string;
}

export type FieldConfigInterface = GlobalConfigInterface;

export interface StateValueInterface {
  rules: FieldRuleInterface[];
  value?: string;
  elem: Element;
  isValid?: boolean;
  isDirty: boolean;
  errorMessage?: string;
  config?: FieldConfigInterface;
}

export interface StateValuesInterface {
  [field: string]: StateValueInterface;
}

interface StateInterface {
  rules: unknown;
  values: StateValuesInterface;
}

interface ContextInterface {
  state: StateInterface;
}
