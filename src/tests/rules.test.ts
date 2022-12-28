import {
  isEmail,
  isLengthMoreThanMax,
  isLengthLessThanMin,
  isNumberLessThanMin,
  isNumberMoreThanMax,
  isPassword,
  isStrongPassword,
  isNumber,
  isInvalidOrEmptyString,
  isInteger,
} from '../utils/validationUtils';

describe('Validate rules', () => {
  test('isEmail', () => {
    expect(isEmail('test@test.com')).toBeTruthy();
    expect(isEmail('ivan123@gmail.com')).toBeTruthy();
    expect(isEmail('ivangmail.com')).toBeFalsy();
    expect(isEmail('ivan@gmailcom')).toBeFalsy();
    expect(isEmail('ivan@')).toBeFalsy();
    expect(isEmail('ivan')).toBeFalsy();
    expect(isEmail('@gmail.com')).toBeFalsy();
    expect(isEmail('')).toBeFalsy();
    expect(isEmail(' ')).toBeFalsy();
  });

  test('isPassword', () => {
    expect(isPassword('1234567f')).toBeTruthy();
    expect(isPassword('qqqqqqq1')).toBeTruthy();
    expect(isPassword('qqqqqqqqqq1')).toBeTruthy();
    expect(isPassword('123456789a')).toBeTruthy();
    expect(isPassword('1234567f!')).toBeTruthy();
    expect(isPassword('1234567f_')).toBeTruthy();
    expect(isPassword('1234567f%')).toBeTruthy();
    expect(isPassword('secret1234!')).toBeTruthy();
    expect(isPassword('1234567')).toBeFalsy();
    expect(isPassword('12345678')).toBeFalsy();
    expect(isPassword('12345678999')).toBeFalsy();
    expect(isPassword('qqqqqqq')).toBeFalsy();
    expect(isPassword('qqqqqqqwwww')).toBeFalsy();
    expect(isPassword('12345678__')).toBeFalsy();
    expect(isPassword('!!!')).toBeFalsy();
    expect(isPassword('!!!!!!!!!!%%__')).toBeFalsy();
    expect(isPassword('')).toBeFalsy();
  });

  test('isNumber', () => {
    expect(isNumber('10')).toBeTruthy();
    expect(isNumber('01')).toBeTruthy();
    expect(isNumber('00')).toBeTruthy();
    expect(isNumber('-10')).toBeTruthy();
    expect(isNumber('-10.10')).toBeTruthy();
    expect(isNumber('d1')).toBeFalsy();
    expect(isNumber('1d')).toBeFalsy();
    expect(isNumber('1d1')).toBeFalsy();
    expect(isNumber('f11')).toBeFalsy();
    expect(isNumber('11.')).toBeTruthy();
    expect(isNumber('11.1.1')).toBeFalsy();
    expect(isNumber('-11.')).toBeTruthy();
    expect(isNumber('.11')).toBeTruthy();
    expect(isNumber('1.1f')).toBeFalsy();
    expect(isNumber('100,10')).toBeFalsy();
    expect(isNumber('-')).toBeFalsy();
    // @ts-ignore
    expect(isNumber(null)).toBeFalsy();
    expect(isNumber('1.0')).toBeTruthy();
    expect(isNumber('100.10')).toBeTruthy();
  });

  test('isInteger', () => {
    expect(isInteger('10')).toBeTruthy();
    expect(isInteger('0')).toBeTruthy();
    expect(isInteger('10')).toBeTruthy();
    expect(isInteger('01')).toBeTruthy();
    expect(isInteger('00')).toBeTruthy();
    expect(isInteger('-10')).toBeTruthy();
    expect(isInteger('-10.10')).toBeFalsy();
    expect(isInteger('d1')).toBeFalsy();
    expect(isInteger('1d')).toBeFalsy();
    expect(isInteger('1d1')).toBeFalsy();
    expect(isInteger('f11')).toBeFalsy();
    expect(isInteger('11.')).toBeFalsy();
    expect(isInteger('11.1.1')).toBeFalsy();
    expect(isInteger('-11.')).toBeFalsy();
    expect(isInteger('.11')).toBeFalsy();
    expect(isInteger('1.1f')).toBeFalsy();
    expect(isInteger('100,10')).toBeFalsy();
    // @ts-ignore
    expect(isInteger(null)).toBeFalsy();
    expect(isInteger('1.0')).toBeFalsy();
    expect(isInteger('100.10')).toBeFalsy();
    expect(isInteger('')).toBeFalsy();
    expect(isInteger('-')).toBeFalsy();
  });

  test('isMinLength', () => {
    expect(isLengthLessThanMin('12', 3)).toBeTruthy();
    expect(isLengthLessThanMin('', 3)).toBeTruthy();
    expect(isLengthLessThanMin('123', 3)).toBeFalsy();
    expect(isLengthLessThanMin('1234', 3)).toBeFalsy();
    expect(isLengthLessThanMin('1234555', 3)).toBeFalsy();
  });

  test('isMaxLength', () => {
    expect(isLengthMoreThanMax('123456', 5)).toBeTruthy();
    expect(isLengthMoreThanMax('123456789', 5)).toBeTruthy();
    expect(isLengthMoreThanMax('12345', 5)).toBeFalsy();
    expect(isLengthMoreThanMax('1234', 5)).toBeFalsy();
    expect(isLengthMoreThanMax('1', 5)).toBeFalsy();
    expect(isLengthMoreThanMax('', 5)).toBeFalsy();
  });

  test('isNumberMoreThanMax', () => {
    expect(isNumberMoreThanMax(8, 5)).toBeTruthy();
    expect(isNumberMoreThanMax(6, 5)).toBeTruthy();
    expect(isNumberMoreThanMax(5, 5)).toBeFalsy();
    expect(isNumberMoreThanMax(0, 5)).toBeFalsy();
  });

  test('isNumberLessThanMin', () => {
    expect(isNumberLessThanMin(4, 5)).toBeTruthy();
    expect(isNumberLessThanMin(0, 5)).toBeTruthy();
    expect(isNumberLessThanMin(5, 5)).toBeFalsy();
    expect(isNumberLessThanMin(8, 5)).toBeFalsy();
  });

  test('isStrongPassword', () => {
    expect(isStrongPassword('123456qA!')).toBeTruthy();
    expect(isStrongPassword('qqqqqqV1!')).toBeTruthy();
    expect(isStrongPassword('qqqqqq1!')).toBeFalsy();
    expect(isStrongPassword('qqqqqqqqq1')).toBeFalsy();
    expect(isStrongPassword('qqqqqqqqq!')).toBeFalsy();
    expect(isStrongPassword('qqqqqqqqqA')).toBeFalsy();
    expect(isStrongPassword('qqqqq_1qA')).toBeFalsy();
  });

  test('isInvalidOrEmptyString', () => {
    expect(isInvalidOrEmptyString()).toBeTruthy();
    expect(isInvalidOrEmptyString(null)).toBeTruthy();
    expect(isInvalidOrEmptyString(false)).toBeTruthy();
    expect(isInvalidOrEmptyString(true)).toBeTruthy();
    expect(isInvalidOrEmptyString('')).toBeTruthy();
    expect(isInvalidOrEmptyString(' ')).toBeFalsy();
    expect(isInvalidOrEmptyString('1')).toBeFalsy();
    expect(isInvalidOrEmptyString('123')).toBeFalsy();
  });
});
