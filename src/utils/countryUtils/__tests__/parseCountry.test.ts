import { CountryData } from '../../../types';
import { parseCountry } from '../parseCountry';

describe('parseCountry', () => {
  test('should parse country into object', () => {
    const fullCountry: CountryData = [
      'Ukraine',
      'ua',
      '380',
      '(..) ... .. ..',
      1,
      ['97', '63', '67', '50'],
    ];

    const fullCountryResult = parseCountry(fullCountry);
    expect(fullCountryResult).toHaveProperty('name', fullCountry[0]);
    expect(fullCountryResult).toHaveProperty('iso2', fullCountry[1]);
    expect(fullCountryResult).toHaveProperty('dialCode', fullCountry[2]);
    expect(fullCountryResult).toHaveProperty('format', fullCountry[3]);
    expect(fullCountryResult).toHaveProperty('priority', fullCountry[4]);
    expect(fullCountryResult).toHaveProperty('areaCodes', fullCountry[5]);
  });

  test('should parse country without areaCodes, priority and format', () => {
    const testCountry: CountryData = ['Ukraine', 'ua', '380'];

    const result = parseCountry(testCountry);
    expect(result).toHaveProperty('name', testCountry[0]);
    expect(result).toHaveProperty('iso2', testCountry[1]);
    expect(result).toHaveProperty('dialCode', testCountry[2]);
    expect(result).toHaveProperty('format', undefined);
    expect(result).toHaveProperty('priority', undefined);
  });
});
