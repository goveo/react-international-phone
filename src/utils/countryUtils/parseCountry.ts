import { CountryData, ParsedCountry } from "../../types";

export const parseCountry = (countryData: CountryData): ParsedCountry => {
  const [name, regions, iso2, dialCode, format, priority] = countryData;
  return {
    name,
    regions,
    iso2,
    dialCode,
    format,
    priority,
  };
};
