import { defaultCountries } from '../../../data/countryData';
import { CountryIso2 } from '../../../types';
import { parseCountry } from '../../countryUtils';
import { validatePhone } from '../validatePhone';

const getCountry = (iso2: CountryIso2) => {
  const country = defaultCountries.find(
    (country) => parseCountry(country).iso2 === iso2,
  );
  if (!country) return;
  return parseCountry(country);
};

describe('validatePhone', () => {
  test('should return validated country', () => {
    expect(validatePhone('+1 (401) 234-5678')).toMatchObject({
      country: getCountry('us'),
    });

    expect(validatePhone('')).toMatchObject({
      country: undefined,
    });

    expect(validatePhone('+999')).toMatchObject({
      country: undefined,
    });

    expect(validatePhone('+380')).toMatchObject({
      country: getCountry('ua'),
    });
  });

  test('should handle phone value fill', () => {
    expect(validatePhone('+1 (999) 999-9999')).toMatchObject({
      filled: true,
    });

    expect(validatePhone('')).toMatchObject({
      filled: false,
    });

    expect(validatePhone('+')).toMatchObject({
      filled: false,
    });

    expect(validatePhone('+380')).toMatchObject({
      filled: false,
    });

    expect(validatePhone('+1 (999) 999-')).toMatchObject({
      filled: false,
    });

    // FIXME: update filled property
    expect(validatePhone('+1 (999) 999-99999')).toMatchObject({
      filled: false,
    });
  });

  test('should handle area code match', () => {
    expect(validatePhone('+1 (402) 999-9999')).toMatchObject({
      country: getCountry('us'),
      areaCodeMatch: true,
    });

    expect(validatePhone('+1 (403) 999-9999')).toMatchObject({
      country: getCountry('ca'),
      areaCodeMatch: true,
    });

    expect(validatePhone('+1 (403)')).toMatchObject({
      country: getCountry('ca'),
      areaCodeMatch: true,
    });

    expect(validatePhone('+1 (999) 999-9999')).toMatchObject({
      country: getCountry('us'),
      areaCodeMatch: false,
    });

    expect(validatePhone('+1')).toMatchObject({
      areaCodeMatch: false,
    });

    // returns undefined if the country has no area codes or no dial code is specified
    expect(validatePhone('+380 (99) 999 99 99')).toMatchObject({
      areaCodeMatch: undefined,
    });

    expect(validatePhone('')).toMatchObject({
      areaCodeMatch: undefined,
    });

    expect(validatePhone('+')).toMatchObject({
      areaCodeMatch: undefined,
    });
  });

  test('should return isValid', () => {
    expect(validatePhone('+1 (201) 234-5678')).toMatchObject({
      isValid: true,
    });

    expect(validatePhone('1 (201) 234-5678')).toMatchObject({
      isValid: false,
    });

    expect(validatePhone('+12012345678')).toMatchObject({
      isValid: false,
    });

    expect(validatePhone('+1 201 234 5678')).toMatchObject({
      isValid: false,
    });

    expect(validatePhone('+1 (402) 999-999')).toMatchObject({
      isValid: false,
    });

    expect(validatePhone('+1 (402) 999-9999-')).toMatchObject({
      isValid: false,
    });

    expect(validatePhone('+1 (402) 999-99999')).toMatchObject({
      isValid: false,
    });
  });
});
