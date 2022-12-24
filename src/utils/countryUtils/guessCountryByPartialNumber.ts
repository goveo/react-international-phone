import { CountryData, CountryGuessResult, ParsedCountry } from '../../types';
import { removeNonDigits } from '../common';
import { parseCountry } from './parseCountry';

export const guessCountryByPartialNumber = ({
  phone: partialPhone,
  countries,
}: {
  phone: string;
  countries: CountryData[];
}): CountryGuessResult => {
  const emptyResult = {
    country: undefined,
    fullDialCodeMatch: false,
    areaCodeMatch: undefined,
  };
  if (!partialPhone) {
    return emptyResult;
  }

  const phone = removeNonDigits(partialPhone);

  if (!phone) {
    return emptyResult;
  }

  let result: CountryGuessResult = emptyResult;

  const updateResult = ({
    country,
    fullDialCodeMatch,
    areaCodeMatch,
  }: {
    country: ParsedCountry;
    fullDialCodeMatch: boolean;
    areaCodeMatch?: boolean;
  }) => {
    const sameDialCode = country.dialCode === result.country?.dialCode;
    const newPriorityValueLower =
      (country.priority ?? 0) < (result.country?.priority ?? 0);

    if (!sameDialCode || newPriorityValueLower) {
      result = { country, fullDialCodeMatch, areaCodeMatch };
    }
  };

  for (const c of countries) {
    const parsedCountry = parseCountry(c);
    const { dialCode, areaCodes } = parsedCountry;

    // full match with dialCode
    if (phone.startsWith(dialCode)) {
      // make sure that we found the largest full dialCode
      const isNewDialCodeLonger = result.country
        ? Number(dialCode) >= Number(result.country.dialCode)
        : true;

      if (areaCodes) {
        const phoneWithoutDialCode = phone.substring(dialCode.length);
        for (const areaCode of areaCodes) {
          if (phoneWithoutDialCode.startsWith(areaCode)) {
            // found full match with area code
            return {
              country: parsedCountry,
              fullDialCodeMatch: true,
              areaCodeMatch: true,
            };
          }
        }
      }

      if (
        isNewDialCodeLonger ||
        dialCode === phone ||
        !result.fullDialCodeMatch
      ) {
        updateResult({
          country: parsedCountry,
          fullDialCodeMatch: true,
          areaCodeMatch: areaCodes ? !areaCodes : undefined,
        });
      }
    }

    // ignore particle matches if full match was found
    if (result.fullDialCodeMatch) continue;

    // particle match with dialCode
    if (phone.length < dialCode.length) {
      if (dialCode.startsWith(phone)) {
        // make sure that we found smallest number dial code
        const isNewCodeLess = result.country
          ? Number(dialCode) <= Number(result.country.dialCode)
          : true;

        if (isNewCodeLess) {
          updateResult({ country: parsedCountry, fullDialCodeMatch: false });
        }
      }
    }
  }

  return result;
};
