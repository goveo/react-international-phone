import { defaultCountries } from '../../../data/countryData';
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
    expect(
      guessCountryByPartialNumber({
        phone: '+380 (99) 999 99 99',
        countries: defaultCountries,
      }),
    ).toEqual(getResult({ country: { iso2: 'ua' } }));

    expect(
      guessCountryByPartialNumber({
        phone: '380999999999',
        countries: defaultCountries,
      }),
    ).toEqual(getResult({ country: { iso2: 'ua' } }));
  });

  test('should guess country by partial number', () => {
    expect(
      guessCountryByPartialNumber({
        phone: '+380 (99)',
        countries: defaultCountries,
      }),
    ).toEqual(getResult({ country: { iso2: 'ua' } }));
    expect(
      guessCountryByPartialNumber({
        phone: '3809',
        countries: defaultCountries,
      }),
    ).toEqual(getResult({ country: { iso2: 'ua' } }));
  });

  test('should guess country by partial dial code', () => {
    const shouldFindUkraine = guessCountryByPartialNumber({
      phone: '+38',
      countries: defaultCountries,
    });
    expect(shouldFindUkraine).toEqual(getResult({ country: { iso2: 'ua' } }));

    const shouldFindGreece = guessCountryByPartialNumber({
      phone: '+3',
      countries: defaultCountries,
    });
    expect(shouldFindGreece).toEqual(getResult({ country: { iso2: 'gr' } }));
    expect(shouldFindGreece).toEqual(
      getResult({ country: { dialCode: '30' } }),
    );
  });

  test('should find smallest number particle dial code', () => {
    const shouldFindGreece = guessCountryByPartialNumber({
      phone: '+3',
      countries: defaultCountries,
    });
    expect(shouldFindGreece).toEqual(
      getResult({ country: { dialCode: '30' } }),
    );

    const shouldFindPeru = guessCountryByPartialNumber({
      phone: '+5',
      countries: defaultCountries,
    });
    expect(shouldFindPeru).toEqual(getResult({ country: { dialCode: '51' } }));

    const shouldFindJapan = guessCountryByPartialNumber({
      phone: '+8',
      countries: defaultCountries,
    });
    expect(shouldFindJapan).toEqual(getResult({ country: { dialCode: '81' } }));

    const shouldFindPortugal = guessCountryByPartialNumber({
      phone: '+35',
      countries: defaultCountries,
    });
    expect(shouldFindPortugal).toEqual(
      getResult({ country: { dialCode: '351' } }),
    );
  });

  test('should respect priority value', () => {
    const shouldFindUS = guessCountryByPartialNumber({
      phone: '+1999',
      countries: defaultCountries,
    });
    expect(shouldFindUS).not.toEqual(
      getResult({ country: { dialCode: '1', name: 'Canada' } }),
    );
    expect(shouldFindUS).toEqual(
      getResult({ country: { dialCode: '1', name: 'United States' } }),
    );
  });

  test('should return undefined if code is not found', () => {
    expect(
      guessCountryByPartialNumber({
        phone: '+999',
        countries: defaultCountries,
      }),
    ).toEqual(getResult({ country: undefined }));
    expect(
      guessCountryByPartialNumber({
        phone: '+000',
        countries: defaultCountries,
      }),
    ).toEqual(getResult({ country: undefined }));
  });

  test('should return undefined if passed empty number', () => {
    expect(
      guessCountryByPartialNumber({ phone: '', countries: defaultCountries }),
    ).toEqual(getResult({ country: undefined }));
    expect(
      guessCountryByPartialNumber({ phone: '+', countries: defaultCountries }),
    ).toEqual(getResult({ country: undefined }));
  });

  test('should return full match if present', () => {
    expect(
      guessCountryByPartialNumber({ phone: '+1', countries: defaultCountries }),
    ).toEqual(getResult({ country: { dialCode: '1' } }));
    expect(
      guessCountryByPartialNumber({
        phone: '+12',
        countries: defaultCountries,
      }),
    ).toEqual(getResult({ country: { dialCode: '1' } }));
    expect(
      guessCountryByPartialNumber({
        phone: '+1242',
        countries: defaultCountries,
      }),
    ).toEqual(getResult({ country: { dialCode: '1242' } }));
  });

  test('should support area codes', () => {
    expect(
      guessCountryByPartialNumber({
        phone: '+1201',
        countries: defaultCountries,
      }),
    ).toEqual(getResult({ country: { dialCode: '1', iso2: 'us' } }));
    expect(
      guessCountryByPartialNumber({
        phone: '+1204',
        countries: defaultCountries,
      }),
    ).toEqual(getResult({ country: { dialCode: '1', iso2: 'ca' } }));
    expect(
      guessCountryByPartialNumber({
        phone: '+7310',
        countries: defaultCountries,
      }),
    ).toEqual(getResult({ country: { dialCode: '7', iso2: 'kz' } }));
  });
});
