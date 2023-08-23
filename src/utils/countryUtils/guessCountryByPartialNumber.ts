import { defaultCountries } from '../../data/countryData';
import {
  CountryData,
  CountryGuessResult,
  CountryIso2,
  ParsedCountry,
} from '../../types';
import { removeNonDigits } from '../common';
import { getCountry } from './getCountry';
import { parseCountry } from './parseCountry';

export const guessCountryByPartialNumber = ({
  phone: partialPhone,
  countries = defaultCountries,
  currentCountryIso2,
}: {
  phone: string;
  countries?: CountryData[];
  currentCountryIso2?: CountryIso2;
}): CountryGuessResult => {
  const emptyResult = {
    country: undefined,
    fullDialCodeMatch: false,
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
  }: {
    country: ParsedCountry;
    fullDialCodeMatch: boolean;
  }) => {
    const sameDialCode = country.dialCode === result.country?.dialCode;
    const newPriorityValueLower =
      (country.priority ?? 0) < (result.country?.priority ?? 0);

    if (!sameDialCode || newPriorityValueLower) {
      result = { country, fullDialCodeMatch };
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

  if (currentCountryIso2) {
    const currentCountry = getCountry({
      value: currentCountryIso2,
      field: 'iso2',
      countries,
    });

    if (!currentCountry) {
      return result;
    }

    const getAreaCodesPartialMatch = (country: ParsedCountry) => {
      if (!country?.areaCodes) return false;

      const phoneWithoutDialCode = phone.substring(country.dialCode.length);

      return country.areaCodes.some((areaCode) =>
        areaCode.startsWith(phoneWithoutDialCode),
      );
    };

    const currentAreaCodePartiallyMatch = currentCountry
      ? getAreaCodesPartialMatch(currentCountry)
      : false;

    const shouldSaveCurrentCountry =
      !!result &&
      // countries have same dial code
      result.country?.dialCode === currentCountry.dialCode &&
      result.country !== currentCountry &&
      result.fullDialCodeMatch &&
      // current country area-code is still partially match input
      (!currentCountry.areaCodes || currentAreaCodePartiallyMatch);

    if (shouldSaveCurrentCountry) {
      result = {
        country: currentCountry,
        fullDialCodeMatch: true,
      };
    }
  }

  return result;
};
