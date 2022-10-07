import { describe, expect, test } from '@jest/globals';

import { ParsedCountry } from '../../../types';
import { guessCountryByPartialNumber } from '../guessCountryByPartialNumber';

describe('guessCountryByPartialNumber', () => {
  const getResult = ({
    country,
    isFullMatch,
  }: {
    country?: Partial<ParsedCountry>;
    isFullMatch?: boolean;
  }) => {
    const countryResult = expect.objectContaining({ ...country });
    const isFullMatchResult = expect.objectContaining({ isFullMatch });
    const result = {
      country: countryResult,
      isFullMatch: isFullMatchResult,
    } as Record<string, unknown>;

    if (typeof countryResult === 'undefined') delete result.country;
    if (typeof isFullMatch === 'undefined') delete result.isFullMatch;
    return expect.objectContaining(result);
  };

  test('should guess country by full number', () => {
    expect(guessCountryByPartialNumber('+380 (99) 999 99 99')).toEqual(
      getResult({ country: { iso2: 'ua' } }),
    );

    expect(guessCountryByPartialNumber('380999999999')).toEqual(
      getResult({ country: { iso2: 'ua' } }),
    );
  });

  test('should guess country by partial number', () => {
    expect(guessCountryByPartialNumber('+380 (99)')).toEqual(
      getResult({ country: { iso2: 'ua' } }),
    );
    expect(guessCountryByPartialNumber('3809')).toEqual(
      getResult({ country: { iso2: 'ua' } }),
    );
  });

  test('should guess country by partial dial code', () => {
    const shouldFindUkraine = guessCountryByPartialNumber('+38');
    expect(shouldFindUkraine).toEqual(getResult({ country: { iso2: 'ua' } }));

    const shouldFindGreece = guessCountryByPartialNumber('+3');
    expect(shouldFindGreece).toEqual(getResult({ country: { iso2: 'gr' } }));
    expect(shouldFindGreece).toEqual(
      getResult({ country: { dialCode: '30' } }),
    );
  });

  test('should find smallest number particle dial code', () => {
    const shouldFindGreece = guessCountryByPartialNumber('+3');
    expect(shouldFindGreece).toEqual(
      getResult({ country: { dialCode: '30' } }),
    );

    const shouldFindPeru = guessCountryByPartialNumber('+5');
    expect(shouldFindPeru).toEqual(getResult({ country: { dialCode: '51' } }));

    const shouldFindJapan = guessCountryByPartialNumber('+8');
    expect(shouldFindJapan).toEqual(getResult({ country: { dialCode: '81' } }));

    const shouldFindPortugal = guessCountryByPartialNumber('+35');
    expect(shouldFindPortugal).toEqual(
      getResult({ country: { dialCode: '351' } }),
    );
  });

  test('should respect priority value', () => {
    const shouldFindUS = guessCountryByPartialNumber('+1999');
    expect(shouldFindUS).not.toEqual(
      getResult({ country: { dialCode: '1', name: 'Canada' } }),
    );
    expect(shouldFindUS).toEqual(
      getResult({ country: { dialCode: '1', name: 'United States' } }),
    );
  });

  test('should return undefined if code is not found', () => {
    expect(guessCountryByPartialNumber('+999')).toEqual(
      getResult({ country: undefined }),
    );
    expect(guessCountryByPartialNumber('+000')).toEqual(
      getResult({ country: undefined }),
    );
  });

  test('should return undefined if passed empty number', () => {
    expect(guessCountryByPartialNumber('')).toEqual(
      getResult({ country: undefined }),
    );
    expect(guessCountryByPartialNumber('+')).toEqual(
      getResult({ country: undefined }),
    );
  });

  test('should return full match if present', () => {
    expect(guessCountryByPartialNumber('+1')).toEqual(
      getResult({ country: { dialCode: '1' } }),
    );
    expect(guessCountryByPartialNumber('+12')).toEqual(
      getResult({ country: { dialCode: '1' } }),
    );
    expect(guessCountryByPartialNumber('+1242')).toEqual(
      getResult({ country: { dialCode: '1242' } }),
    );
  });
});
