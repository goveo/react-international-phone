import { countries } from '../../data/countryData';
import { CountryGuessResult, ParsedCountry } from '../../types';
import { removeNonDigits } from '../common';
import { parseCountry } from './parseCountry';

export const guessCountryByPartialNumber = (
  partialPhone: string,
): CountryGuessResult | undefined => {
  if (!partialPhone) {
    return undefined;
  }

  const phone = removeNonDigits(partialPhone);

  if (!phone) {
    return undefined;
  }

  let result: CountryGuessResult = { country: undefined, isFullMatch: false };

  const updateResult = ({
    country,
    isFullMatch,
  }: {
    country: ParsedCountry;
    isFullMatch: boolean;
  }) => {
    const sameDialCode = country.dialCode === result.country?.dialCode;
    const newPriorityValueLower =
      (country.priority ?? 0) < (result.country?.priority ?? 0);

    if (!sameDialCode || newPriorityValueLower) {
      result = { country, isFullMatch };
    }
  };

  for (const c of countries) {
    const parsedCountry = parseCountry(c);
    const { dialCode } = parsedCountry;

    // full match with dialCode
    if (phone.startsWith(dialCode)) {
      // make sure that we found the largest full dialCode
      const isNewDialCodeLonger = result.country
        ? Number(dialCode) >= Number(result.country.dialCode)
        : true;

      if (isNewDialCodeLonger || dialCode === phone || !result.isFullMatch) {
        updateResult({ country: parsedCountry, isFullMatch: true });
      }
    }

    // ignore particle matches if full match was found
    if (result.isFullMatch) continue;

    // particle match with dialCode
    if (phone.length < dialCode.length) {
      if (dialCode.startsWith(phone)) {
        // make sure that we found smallest number dial code
        const isNewCodeLess = result.country
          ? Number(dialCode) <= Number(result.country.dialCode)
          : true;

        if (isNewCodeLess) {
          updateResult({ country: parsedCountry, isFullMatch: false });
        }
      }
    }
  }

  return result;
};
