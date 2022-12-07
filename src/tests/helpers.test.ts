import { getClassList, isPromise } from '../utils/helperUtils';

describe('Helpers', () => {
  test('getClassList', () => {
    expect(getClassList()).toStrictEqual([]);
    expect(getClassList('one two')).toStrictEqual(['one', 'two']);
    expect(getClassList('one  two')).toStrictEqual(['one', 'two']);
    expect(getClassList('  one  two  ')).toStrictEqual(['one', 'two']);
    expect(getClassList('  one  ')).toStrictEqual(['one']);
    expect(getClassList('one')).toStrictEqual(['one']);
    expect(getClassList(['one'])).toStrictEqual(['one']);
    expect(getClassList(['one', 'two'])).toStrictEqual(['one', 'two']);
    expect(getClassList(['', 'two'])).toStrictEqual(['two']);
    expect(getClassList([''])).toStrictEqual([]);
    expect(getClassList('')).toStrictEqual([]);
    expect(getClassList('   ')).toStrictEqual([]);
  });

  test('isPromise', () => {
    const promise = new Promise((resolve) => resolve(true));
    expect(isPromise()).toBeFalsy();
    expect(isPromise(null)).toBeFalsy();
    expect(isPromise({})).toBeFalsy();
    expect(isPromise({ then: true })).toBeFalsy();
    expect(isPromise(123)).toBeFalsy();
    expect(isPromise('123')).toBeFalsy();
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    expect(isPromise(() => {})).toBeFalsy();
    expect(isPromise({ a: '123' })).toBeFalsy();
    expect(isPromise(promise)).toBeTruthy();
  });
});
