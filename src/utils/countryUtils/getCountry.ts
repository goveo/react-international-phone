import { countries } from "../../data/countryData";
import { CountryData, ParsedCountry } from "../../types";
import { parseCountry } from "./parseCountry";

export const getCountry = (
  value: CountryData[number],
  field: keyof ParsedCountry,
): ParsedCountry | undefined => {
  const country = countries.find((country) => {
    const parsedCountry = parseCountry(country);
    return value === parsedCountry[field];
  });

  if (!country) return undefined;
  return parseCountry(country);
};
