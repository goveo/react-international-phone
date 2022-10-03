import { describe, expect, test } from '@jest/globals';

import { guessCountryByPartialNumber } from '../guessCountryByPartialNumber';

describe('guessCountryByPartialNumber', () => {
  test('should guess country by full number', () => {
    expect(guessCountryByPartialNumber('+380 (99) 999 99 99')).toHaveProperty(
      'iso2',
      'ua',
    );
    expect(guessCountryByPartialNumber('380999999999')).toHaveProperty(
      'iso2',
      'ua',
    );
  });

  test('should guess country by partial number', () => {
    expect(guessCountryByPartialNumber('+380 (99)')).toHaveProperty(
      'iso2',
      'ua',
    );
    expect(guessCountryByPartialNumber('3809')).toHaveProperty('iso2', 'ua');
  });

  test('should guess country by partial dial code', () => {
    const shouldFindUkraine = guessCountryByPartialNumber('+38');
    expect(shouldFindUkraine).toHaveProperty('iso2', 'ua');

    const shouldFindGreece = guessCountryByPartialNumber('+3');
    expect(shouldFindGreece).toHaveProperty('iso2', 'gr');
    expect(shouldFindGreece).toHaveProperty('dialCode', '30');
  });

  test('should find longest country code match', () => {
    const shouldFindBahamas = guessCountryByPartialNumber('+124');
    expect(shouldFindBahamas).not.toHaveProperty('dialCode', '1');
    expect(shouldFindBahamas).toHaveProperty('dialCode', '1242');
  });

  test('should respect priority value', () => {
    const shouldFindUS = guessCountryByPartialNumber('+1999');
    expect(shouldFindUS).toHaveProperty('dialCode', '1');
    expect(shouldFindUS).not.toHaveProperty('name', 'Canada');
    expect(shouldFindUS).toHaveProperty('name', 'United States');
  });

  test('should return undefined if code is not found', () => {
    expect(guessCountryByPartialNumber('+999')).toBeUndefined();
    expect(guessCountryByPartialNumber('+000')).toBeUndefined();
  });

  test('should return undefined if passed empty number', () => {
    expect(guessCountryByPartialNumber('')).toBeUndefined();
    expect(guessCountryByPartialNumber('+')).toBeUndefined();
  });
});
