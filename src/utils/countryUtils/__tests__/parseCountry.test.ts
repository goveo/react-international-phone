import { CountryData } from '../../../types';
import { parseCountry } from '../parseCountry';

describe('parseCountry', () => {
  test('should parse country into object', () => {
    const fullCountry: CountryData = [
      'Ukraine',
      ['europe', 'ex-ussr'],
      'ua',
      '380',
      '(..) ... .. ..',
      1,
    ];

    const fullCountryResult = parseCountry(fullCountry);
    expect(fullCountryResult).toHaveProperty('name', fullCountry[0]);
    expect(fullCountryResult).toHaveProperty('regions', fullCountry[1]);
    expect(fullCountryResult).toHaveProperty('iso2', fullCountry[2]);
    expect(fullCountryResult).toHaveProperty('dialCode', fullCountry[3]);
    expect(fullCountryResult).toHaveProperty('format', fullCountry[4]);
    expect(fullCountryResult).toHaveProperty('priority', fullCountry[5]);
  });

  test('should parse country without priority and format', () => {
    const testCountry: CountryData = [
      'Ukraine',
      ['europe', 'ex-ussr'],
      'ua',
      '380',
    ];

    const result = parseCountry(testCountry);
    expect(result).toHaveProperty('name', testCountry[0]);
    expect(result).toHaveProperty('regions', testCountry[1]);
    expect(result).toHaveProperty('iso2', testCountry[2]);
    expect(result).toHaveProperty('dialCode', testCountry[3]);
    expect(result).toHaveProperty('format', undefined);
    expect(result).toHaveProperty('priority', undefined);
  });
});
