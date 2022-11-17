import { CountryData, ParsedCountry } from '../../types';

export const buildCountryData = (parsedCountry: ParsedCountry): CountryData => {
  const { name, regions, iso2, dialCode, format, priority, areaCodes } =
    parsedCountry;

  const countryData = [
    name,
    regions,
    iso2,
    dialCode,
    format,
    priority,
    areaCodes,
  ].filter(Boolean) as CountryData;

  return countryData;
};
