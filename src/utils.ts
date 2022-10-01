import { countries, CountryData } from "./data/countryData";

export const removeNonDigits = (value: string): string => {
  return value.replace(/\D/g, "");
};

export interface ParsedCountry {
  name: CountryData[0];
  regions: CountryData[1];
  iso2: CountryData[2];
  dialCode: CountryData[3];
  format: CountryData[4];
  priority: CountryData[5];
}

const parseCountry = (countryData: CountryData): ParsedCountry => {
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

export const guessCountryByPartialNumber = (
  partialPhone: string,
): ParsedCountry | undefined => {
  let _country: ParsedCountry | undefined;

  const updateCountry = (parsedCountry: ParsedCountry) => {
    // make sure that we found longest dialCode match
    if (parsedCountry.dialCode.length > (_country?.dialCode?.length ?? 0)) {
      _country = parsedCountry;
    }
  };

  const phone = removeNonDigits(partialPhone);

  countries.forEach((c) => {
    const parsedCountry = parseCountry(c);
    const { dialCode } = parsedCountry;

    // particle match with dialCode
    if (partialPhone.length < dialCode.length) {
      if (dialCode.startsWith(phone)) {
        updateCountry(parsedCountry);
      }
      return;
    }

    // full match with dialCode
    if (phone.startsWith(dialCode)) {
      updateCountry(parsedCountry);
    }
  });

  return _country;
};
