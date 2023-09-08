import { MASK_CHAR } from '../hooks/usePhoneInput';
import { CountryData, CountryGuessResult, ParsedCountry } from '../types';
import {
  getCountryMaskFormat,
  guessCountryByPartialNumber,
} from './countryUtils';
import { formatPhone, toE164 } from './phoneUtils';

interface HandlePhoneChangeProps {
  value: string;
  country?: ParsedCountry;
  trimNonDigitsEnd: boolean;
  insertDialCodeOnEmpty: boolean;
  forceDisableCountryGuess: boolean;
  countryGuessingEnabled: boolean;
  countries: CountryData[];
  disableDialCodeAndPrefix: boolean;
  prefix: string;
  defaultMask: string;
  charAfterDialCode: string;
  forceDialCode: boolean;
}

export function handlePhoneChange({
  value,
  country,
  trimNonDigitsEnd,
  insertDialCodeOnEmpty,
  forceDisableCountryGuess,
  countryGuessingEnabled,
  countries,
  disableDialCodeAndPrefix,
  prefix,
  defaultMask,
  charAfterDialCode,
  forceDialCode,
}: HandlePhoneChangeProps): {
  phone: string;
  countryGuessResult?: CountryGuessResult | undefined;
  formatCountry?: ParsedCountry | undefined;
} {
  const shouldGuessCountry =
    !forceDisableCountryGuess && countryGuessingEnabled;

  const countryGuessResult = shouldGuessCountry
    ? guessCountryByPartialNumber({
        phone: value,
        countries,
        currentCountryIso2: country?.iso2,
      }) // FIXME: should not guess country on every change
    : undefined;

  const formatCountry = countryGuessResult?.country ?? country;

  const phone = formatCountry
    ? formatPhone(
        toE164({
          displayPhone: value,
          country: formatCountry,
          disableDialCodeAndPrefix,
          allowEmpty: true,
        }),
        {
          prefix,
          mask: getCountryMaskFormat({
            phone: value,
            country: formatCountry,
            prefix,
            defaultMask,
            charAfterDialCode,
          }),
          maskChar: MASK_CHAR,
          dialCode: formatCountry.dialCode,
          trimNonDigitsEnd,
          charAfterDialCode,
          forceDialCode,
          insertDialCodeOnEmpty,
          disableDialCodeAndPrefix,
        },
      )
    : value;

  return { phone, countryGuessResult, formatCountry };
}
