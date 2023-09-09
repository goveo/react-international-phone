import { MASK_CHAR } from '../hooks/usePhoneInput';
import { CountryData, ParsedCountry } from '../types';
import {
  getCountryMaskFormat,
  guessCountryByPartialNumber,
} from './countryUtils';
import { formatPhone, toE164 } from './phoneUtils';

export interface PhoneFormattingConfig {
  countries: CountryData[];
  prefix: string;
  charAfterDialCode: string;
  forceDialCode: boolean;
  disableDialCodeAndPrefix: boolean;
  defaultMask: string;
  countryGuessingEnabled: boolean;
}

interface HandlePhoneChangeProps extends PhoneFormattingConfig {
  value: string;
  country: ParsedCountry;
  insertDialCodeOnEmpty: boolean;
  trimNonDigitsEnd?: boolean;
  lastTypedChar?: string;
}

export function handlePhoneChange({
  value,
  country,
  insertDialCodeOnEmpty,
  trimNonDigitsEnd,
  lastTypedChar,

  countries,
  prefix,
  charAfterDialCode,
  forceDialCode,
  disableDialCodeAndPrefix,
  defaultMask,
  countryGuessingEnabled,
}: HandlePhoneChangeProps): {
  phone: string;
  country: ParsedCountry;
} {
  const shouldGuessCountry = () => {
    if (disableDialCodeAndPrefix) {
      // if last typed char is prefix -> ignore country guess (user can add "+" to the beginning of input)
      if (lastTypedChar === prefix) return false;
      // guess country only if value starts with dial code (handle past form clipboard or autofill)
      return value.startsWith(prefix);
    }
    return countryGuessingEnabled;
  };

  const countryGuessResult = shouldGuessCountry()
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

  return { phone, country: formatCountry };
}
