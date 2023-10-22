import { isNumeric } from '../isNumeric';

describe('isNumeric', () => {
  test('should check if provided string is numeric', () => {
    expect(isNumeric('0')).toBe(true);
    expect(isNumeric('1')).toBe(true);
    expect(isNumeric('380')).toBe(true);
    expect(isNumeric('+1')).toBe(false);
    expect(isNumeric('1e10')).toBe(false);
    expect(isNumeric('test')).toBe(false);
    expect(isNumeric('Number(0)')).toBe(false);
  });

  test('should handle empty values', () => {
    expect(isNumeric('')).toBe(false);
    expect(isNumeric(undefined)).toBe(false);
  });
});
