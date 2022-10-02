import { countries } from "../../data/countryData";
import { ParsedCountry } from "../../types";
import { removeNonDigits } from "../common";
import { parseCountry } from "./parseCountry";

export const guessCountryByPartialNumber = (
  partialPhone: string,
): ParsedCountry | undefined => {
  if (!partialPhone) {
    return undefined;
  }

  const phone = removeNonDigits(partialPhone);

  if (!phone) {
    return undefined;
  }

  let _currentCountry: ParsedCountry | undefined;

  for (const c of countries) {
    const parsedCountry = parseCountry(c);
    const { dialCode } = parsedCountry;

    const dialCodeAsNumber = Number(dialCode);

    // particle match with dialCode
    if (phone.length < dialCode.length) {
      if (dialCode.startsWith(phone)) {
        // make sure that we found shorter dialCode match
        const isNewDialCodeShorter = _currentCountry
          ? dialCodeAsNumber < Number(_currentCountry.dialCode)
          : true;

        if (isNewDialCodeShorter) {
          _currentCountry = parsedCountry;
        }
      }
      continue;
    }

    // full match with dialCode
    if (phone.startsWith(dialCode)) {
      // make sure that we found longest dialCode match
      const isNewDialCodeLonger = _currentCountry
        ? dialCode.length > _currentCountry.dialCode.length
        : true;

      if (isNewDialCodeLonger) {
        _currentCountry = parsedCountry;
      }
    }
  }

  return _currentCountry;
};
