import { CountryData } from '../../../types';
import { buildCountryData } from '../buildCountryData';
import { parseCountry } from '../parseCountry';

describe('buildCountryData', () => {
  test('should build countryData from parsed country', () => {
    const fullCountry: CountryData = [
      'Ukraine',
      ['europe', 'ex-ussr'],
      'ua',
      '380',
      '(..) ... .. ..',
      1,
      ['97', '63', '67', '50'],
    ];

    const parsedCountry = parseCountry(fullCountry);

    const country = buildCountryData(parsedCountry);

    expect(country[0]).toEqual(parsedCountry.name);
    expect(country[1]).toEqual(parsedCountry.regions);
    expect(country[2]).toEqual(parsedCountry.iso2);
    expect(country[3]).toEqual(parsedCountry.dialCode);
    expect(country[4]).toEqual(parsedCountry.format);
    expect(country[5]).toEqual(parsedCountry.priority);
    expect(country[6]).toEqual(parsedCountry.areaCodes);
  });

  test('should build countryData from parsed country (without areaCodes, priority and format)', () => {
    const fullCountry: CountryData = [
      'Ukraine',
      ['europe', 'ex-ussr'],
      'ua',
      '380',
    ];

    const parsedCountry = parseCountry(fullCountry);
    const country = buildCountryData(parsedCountry);

    expect(country.length).toEqual(4);
    expect(country[0]).toEqual(parsedCountry.name);
    expect(country[1]).toEqual(parsedCountry.regions);
    expect(country[2]).toEqual(parsedCountry.iso2);
    expect(country[3]).toEqual(parsedCountry.dialCode);
    expect(country[4]).toEqual(undefined);
    expect(country[5]).toEqual(undefined);
    expect(country[6]).toEqual(undefined);
  });

  test('should build countryData from object', () => {
    const country = buildCountryData({
      name: 'Ukraine',
      regions: [],
      iso2: 'ua',
      dialCode: '380',
      format: '.........',
      priority: undefined,
      areaCodes: undefined,
    });

    expect(country.length).toEqual(5);
    expect(country[0]).toEqual('Ukraine');
    expect(country[1]).toEqual([]);
    expect(country[2]).toEqual('ua');
    expect(country[3]).toEqual('380');
    expect(country[4]).toEqual('.........');
    expect(country[5]).toEqual(undefined);
    expect(country[6]).toEqual(undefined);
  });

  test('should bot allow create invalid countries', () => {
    expect(() =>
      buildCountryData({
        name: 'Ukraine',
        regions: [],
        iso2: 'ua',
        dialCode: '380',
        format: undefined,
        priority: 1,
        areaCodes: undefined,
      }),
    ).toThrowError();

    expect(() =>
      buildCountryData({
        name: 'Ukraine',
        regions: [],
        iso2: 'ua',
        dialCode: '380',
        format: undefined,
        priority: undefined,
        areaCodes: ['1'],
      }),
    ).toThrowError();

    expect(() =>
      buildCountryData({
        name: 'Ukraine',
        regions: [],
        iso2: 'ua',
        dialCode: '380',
        format: '............',
        priority: undefined,
        areaCodes: ['1'],
      }),
    ).toThrowError();
  });
});
