import { CountryData, ParsedCountry } from '../../types';

export const parseCountry = (countryData: CountryData): ParsedCountry => {
  const [name, iso2, dialCode, format, priority, areaCodes] = countryData;
  return {
    name,
    iso2,
    dialCode,
    format,
    priority,
    areaCodes,
  };
};
