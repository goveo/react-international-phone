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
  disableFormatting: boolean;
}

interface HandlePhoneChangeProps extends PhoneFormattingConfig {
  value: string;
  country: ParsedCountry;
  insertDialCodeOnEmpty: boolean;
  trimNonDigitsEnd?: boolean;
}

export function handlePhoneChange({
  value,
  country,
  insertDialCodeOnEmpty,
  trimNonDigitsEnd,

  countries,
  prefix,
  charAfterDialCode,
  forceDialCode,
  disableDialCodeAndPrefix,
  defaultMask,
  countryGuessingEnabled,
  disableFormatting,
}: HandlePhoneChangeProps): {
  phone: string;
  e164Phone: string;
  country: ParsedCountry;
} {
  let inputPhone = value;

  // make sure that inputPhone starts with dial code when dial code is disabled
  if (disableDialCodeAndPrefix) {
    inputPhone = inputPhone.startsWith(`${prefix}`)
      ? inputPhone
      : `${prefix}${country.dialCode}${inputPhone}`;
  }

  const countryGuessResult = countryGuessingEnabled
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
      disableFormatting,
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

  const e164Phone = toE164({
    phone: disableDialCodeAndPrefix
      ? `${resultCountry.dialCode}${phone}`
      : phone,
    prefix,
  });

  return {
    phone,
    e164Phone,
    country: resultCountry,
  };
}
