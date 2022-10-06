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

  test('should find smallest number particle dial code', () => {
    const shouldFindGreece = guessCountryByPartialNumber('+3');
    expect(shouldFindGreece).toHaveProperty('dialCode', '30');

    const shouldFindPeru = guessCountryByPartialNumber('+5');
    expect(shouldFindPeru).toHaveProperty('dialCode', '51');

    const shouldFindJapan = guessCountryByPartialNumber('+8');
    expect(shouldFindJapan).toHaveProperty('dialCode', '81');

    const shouldFindPortugal = guessCountryByPartialNumber('+35');
    expect(shouldFindPortugal).toHaveProperty('dialCode', '351');
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

  test('should return full match if present', () => {
    expect(guessCountryByPartialNumber('+1')).toHaveProperty('dialCode', '1');
    expect(guessCountryByPartialNumber('+12')).toHaveProperty('dialCode', '1');
    expect(guessCountryByPartialNumber('+1242')).toHaveProperty(
      'dialCode',
      '1242',
    );
  });
});
