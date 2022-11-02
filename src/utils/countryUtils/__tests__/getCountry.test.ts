import { defaultCountries } from '../../../data/countryData';
import { getCountry } from '../getCountry';

describe('getCountry', () => {
  test('should get country by iso2', () => {
    const uaResult = getCountry({
      value: 'ua',
      field: 'iso2',
      countries: defaultCountries,
    });
    expect(uaResult).toHaveProperty('name', 'Ukraine');
    expect(uaResult).toHaveProperty('iso2', 'ua');
    expect(uaResult).toHaveProperty('dialCode', '380');

    expect(
      getCountry({ value: 'us', field: 'iso2', countries: defaultCountries }),
    ).toHaveProperty('name', 'United States');
    expect(
      getCountry({ value: 'dk', field: 'iso2', countries: defaultCountries }),
    ).toHaveProperty('name', 'Denmark');

    expect(
      getCountry({ value: 'test', field: 'iso2', countries: defaultCountries }),
    ).toBeUndefined();
  });

  test('should get country by dialCode', () => {
    const uaResult = getCountry({
      value: '380',
      field: 'dialCode',
      countries: defaultCountries,
    });
    expect(uaResult).toHaveProperty('name', 'Ukraine');
    expect(uaResult).toHaveProperty('iso2', 'ua');
    expect(uaResult).toHaveProperty('dialCode', '380');

    expect(
      getCountry({ value: '000', field: 'iso2', countries: defaultCountries }),
    ).toBeUndefined();
  });

  test('should get country by format', () => {
    const canadaResult = getCountry({
      value: '(...) ...-....',
      field: 'format',
      countries: defaultCountries,
    });
    // find first country with property
    expect(canadaResult).toHaveProperty('name', 'Canada');
    expect(canadaResult).toHaveProperty('iso2', 'ca');
    expect(canadaResult).toHaveProperty('dialCode', '1');

    expect(
      getCountry({
        value: 'wrong-format',
        field: 'format',
        countries: defaultCountries,
      }),
    ).toBeUndefined();
  });

  test('should get country by name', () => {
    const canadaResult = getCountry({
      value: 'Canada',
      field: 'name',
      countries: defaultCountries,
    });
    // find first country with property
    expect(canadaResult).toHaveProperty('name', 'Canada');
    expect(canadaResult).toHaveProperty('iso2', 'ca');
    expect(canadaResult).toHaveProperty('dialCode', '1');

    expect(
      getCountry({
        value: 'wrong-format',
        field: 'format',
        countries: defaultCountries,
      }),
    ).toBeUndefined();
  });

  test('should throw on unsupported search fields', () => {
    expect(() =>
      getCountry({ value: 1, field: 'priority', countries: defaultCountries }),
    ).toThrowError();
    expect(() =>
      getCountry({
        value: ['europe'],
        field: 'regions',
        countries: defaultCountries,
      }),
    ).toThrowError();
  });
});
