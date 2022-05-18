import { getClassList } from '../utils/helperUtils';

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
});
