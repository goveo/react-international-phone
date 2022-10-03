import { countries } from '../../data/countryData';
import { ParsedCountry } from '../../types';
import { parseCountry } from './parseCountry';

export const getCountryByCode = (
  countryCode: string,
): ParsedCountry | undefined => {
  const country = countries.find((country) => {
    const { iso2 } = parseCountry(country);
    return iso2 === countryCode;
  });

  if (!country) return undefined;
  return parseCountry(country);
};
