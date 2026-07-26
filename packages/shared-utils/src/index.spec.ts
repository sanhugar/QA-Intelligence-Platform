import { isPositiveFiniteNumber, trimToEmpty } from './index';

describe('@ati/shared-utils', () => {
  it('trims and validates positive numbers', () => {
    expect(trimToEmpty('  x  ')).toBe('x');
    expect(isPositiveFiniteNumber(1)).toBe(true);
    expect(isPositiveFiniteNumber(0)).toBe(false);
  });
});
