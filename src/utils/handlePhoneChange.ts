import { MASK_CHAR } from '../hooks/usePhoneInput';
import { CountryData, ParsedCountry } from '../types';
import { removeNonDigits } from './common';
import {
  getCountryMaskFormat,
  guessCountryByPartialNumber,
} from './countryUtils';
import { formatPhone } from './phoneUtils';

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
  e164Phone: string;
  country: ParsedCountry;
} {
  let inputPhone = value;

  // make sure that inputPhone starts with dial code when dial code is disabled
  if (disableDialCodeAndPrefix) {
    // TODO: allow dial code change when new e164 phone pasted from clipboard
    inputPhone = inputPhone.startsWith(`${prefix}${country.dialCode}`)
      ? inputPhone
      : `${prefix}${country.dialCode}${inputPhone}`;
  }

  const shouldGuessCountry = () => {
    if (disableDialCodeAndPrefix) {
      // if last typed char is prefix -> ignore country guess (user can add "+" to the beginning of input)
      if (lastTypedChar === prefix) return false;
      // guess country only if value starts with dial code (handle past form clipboard or autofill)
      return inputPhone.startsWith(prefix);
    }
    return countryGuessingEnabled;
  };

  const countryGuessResult = shouldGuessCountry()
    ? guessCountryByPartialNumber({
        phone: inputPhone,
        countries,
        currentCountryIso2: country?.iso2,
      }) // FIXME: should not guess country on every change
    : undefined;

  const formatCountry = countryGuessResult?.country ?? country;

  const phone = formatPhone(inputPhone, {
    prefix,
    mask: getCountryMaskFormat({
      phone: inputPhone,
      country: formatCountry,
      prefix,
      defaultMask,
    }),
    maskChar: MASK_CHAR,
    dialCode: formatCountry.dialCode,
    trimNonDigitsEnd,
    charAfterDialCode,
    forceDialCode,
    insertDialCodeOnEmpty,
    disableDialCodeAndPrefix,
  });

  const resultCountry =
    countryGuessingEnabled && !countryGuessResult?.fullDialCodeMatch
      ? country
      : formatCountry;

  const getE164Phone = () => {
    if (disableDialCodeAndPrefix) {
      return `${prefix}${resultCountry.dialCode}${removeNonDigits(phone)}`;
    }

    return phone ? `${prefix}${removeNonDigits(phone)}` : '';
  };

  return { phone, e164Phone: getE164Phone(), country: resultCountry };
}
