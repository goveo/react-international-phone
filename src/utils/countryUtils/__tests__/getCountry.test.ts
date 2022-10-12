import { getCountry } from '../getCountry';

describe('getCountry', () => {
  test('should get country by iso2', () => {
    const uaResult = getCountry('ua', 'iso2');
    expect(uaResult).toHaveProperty('name', 'Ukraine');
    expect(uaResult).toHaveProperty('iso2', 'ua');
    expect(uaResult).toHaveProperty('dialCode', '380');

    expect(getCountry('us', 'iso2')).toHaveProperty('name', 'United States');
    expect(getCountry('dk', 'iso2')).toHaveProperty('name', 'Denmark');

    expect(getCountry('test', 'iso2')).toBeUndefined();
  });

  test('should get country by dialCode', () => {
    const uaResult = getCountry('380', 'dialCode');
    expect(uaResult).toHaveProperty('name', 'Ukraine');
    expect(uaResult).toHaveProperty('iso2', 'ua');
    expect(uaResult).toHaveProperty('dialCode', '380');

    expect(getCountry('000', 'iso2')).toBeUndefined();
  });

  test('should get country by format', () => {
    const canadaResult = getCountry('(...) ...-....', 'format');
    // find first country with property
    expect(canadaResult).toHaveProperty('name', 'Canada');
    expect(canadaResult).toHaveProperty('iso2', 'ca');
    expect(canadaResult).toHaveProperty('dialCode', '1');

    expect(getCountry('wrong-format', 'format')).toBeUndefined();
  });

  test('should get country by name', () => {
    const canadaResult = getCountry('Canada', 'name');
    // find first country with property
    expect(canadaResult).toHaveProperty('name', 'Canada');
    expect(canadaResult).toHaveProperty('iso2', 'ca');
    expect(canadaResult).toHaveProperty('dialCode', '1');

    expect(getCountry('wrong-format', 'format')).toBeUndefined();
  });

  test('should throw on unsupported search fields', () => {
    expect(() => getCountry(1, 'priority')).toThrowError();
    expect(() => getCountry(['europe'], 'regions')).toThrowError();
  });
});
