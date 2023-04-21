import { defaultConfig, MASK_CHAR } from '../../hooks/usePhoneInput';
import { CountryData, CountryIso2, ParsedCountry } from '../../types';
import { removeNonDigits } from '../common';
import { getCountry, guessCountryByPartialNumber } from '../countryUtils';

export interface ValidatePhoneConfig {
  /**
   * Country to validate
   */
  country?: CountryIso2;
  /**
   * Custom countries list
   */
  countries?: CountryData[];

  prefix?: string;
  charAfterDialCode?: string;
  defaultMask?: string;
  defaultMaskMinPhoneLength?: number;
}

export interface ValidatePhoneReturn {
  country: ParsedCountry | undefined;
  isValid: boolean;
  /**
   * Phone number overflow is allowed:
   * +1 (999) 999-99999 will set `lengthMatch: true`.
   *
   * This is needed for countries that does not have format,
   * and share same dial code with another countries (like 'do')
   * For example: +1 999999999999 will be parsed as 'us', but we need to mark it as valid phone
   */
  lengthMatch: boolean;
  areaCodeMatch: boolean | undefined;
  dialCodeMatch: boolean;
  formatMatch: boolean;
}

export const validatePhone = (
  phone: string,
  config?: ValidatePhoneConfig,
): ValidatePhoneReturn => {
  const {
    countries,
    defaultMask,
    defaultMaskMinPhoneLength = 10,
    prefix,
    charAfterDialCode,
  } = {
    ...defaultConfig,
    ...config,
  };

  const passedCountry = config?.country
    ? getCountry({ value: config.country, field: 'iso2', countries })
    : null;

  const countryGuessResult = guessCountryByPartialNumber({
    phone,
    countries,
    currentCountryIso2: config?.country,
  });

  const isPassedCountryValid =
    countryGuessResult.country?.iso2 === passedCountry?.iso2;

  const {
    country,
    fullDialCodeMatch: dialCodeMatch,
    areaCodeMatch,
  } = !passedCountry || isPassedCountryValid
    ? countryGuessResult
    : {
        country: passedCountry,
        fullDialCodeMatch: false,
        areaCodeMatch: passedCountry?.areaCodes ? false : undefined,
      };

  // Handle non-existent dial code
  if (!country) {
    return {
      country: country,
      lengthMatch: false,
      dialCodeMatch,
      areaCodeMatch,
      formatMatch: false,
      isValid: false,
    };
  }

  const countryMask = country.format || defaultMask;
  const isDefaultMask = !country.format;

  // mask length (only digits)
  const requiredMaskLength = isDefaultMask
    ? defaultMaskMinPhoneLength - country.dialCode.length
    : countryMask.length - countryMask.replaceAll(MASK_CHAR, '').length;

  const expectedMaskPart = isDefaultMask
    ? countryMask.slice(0, requiredMaskLength)
    : countryMask;

  const expectedFormat = `${prefix}${country.dialCode}${charAfterDialCode}${expectedMaskPart}`;

  // Validate formatting
  const formatMatch = expectedFormat.split('').every((formatChar, i) => {
    const isCharFullMatch = phone[i] === formatChar;
    const isNumberMatch =
      formatChar === MASK_CHAR && Number.isFinite(+phone[i]);

    return isCharFullMatch || isNumberMatch;
  });

  const rawPhone = removeNonDigits(phone);
  const requiredRawPhoneLength = country.dialCode.length + requiredMaskLength;

  // Validate length
  if (rawPhone.length < requiredRawPhoneLength) {
    return {
      country,
      lengthMatch: false,
      dialCodeMatch,
      areaCodeMatch,
      formatMatch,
      isValid: false,
    };
  }

  return {
    country,
    lengthMatch: true,
    dialCodeMatch,
    areaCodeMatch,
    formatMatch,
    isValid: rawPhone.startsWith(country.dialCode),
  };
};
