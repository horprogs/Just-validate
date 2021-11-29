const EMAIL_REGEXP =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const NUMBER_REGEXP = /^[0-9]+$/;
// Minimum eight characters, at least one letter and one number
const PASSWORD_REGEXP = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
// Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character
const STRONG_PASSWORD_REGEXP =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const isEmpty = (value: string | boolean) => {
  let newVal = value;

  if (typeof value === 'string') {
    newVal = value.trim();
  }

  return !newVal;
};

export const isEmail = (value: string) => {
  return EMAIL_REGEXP.test(value);
};

export const isLengthMoreThanMax = (value: string, len: number) => {
  return value.length > len;
};

export const isLengthLessThanMin = (value: string, len: number) => {
  return value.length < len;
};

export const isNumber = (value: string) => {
  return NUMBER_REGEXP.test(value);
};

export const isPassword = (value: string) => {
  return PASSWORD_REGEXP.test(value);
};

export const isStrongPassword = (value: string) => {
  return STRONG_PASSWORD_REGEXP.test(value);
};

export const isNumberMoreThanMax = (value: number, len: number) => {
  return value > len;
};

export const isNumberLessThanMin = (value: number, len: number) => {
  return value < len;
};
