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
  lengthMatch: boolean;
  areaCodeMatch: boolean | undefined;
  dialCodeMatch: boolean;
}

export const validatePhone = (
  /**
   * Phone value to validate
   */
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
      isValid: false,
    };
  }

  // Validate phone start (prefix + dial code + char after code)
  const phoneStart = `${prefix}${country.dialCode}${charAfterDialCode}`;
  if (!phone.startsWith(phoneStart)) {
    return {
      country,
      lengthMatch: false,
      dialCodeMatch,
      areaCodeMatch,
      isValid: false,
    };
  }

  const maskPart = phone.substring(phoneStart.length);

  const isDefaultMask = !country.format;
  const countryMask = isDefaultMask ? defaultMask : (country.format as string);

  // Validate default mask
  if (
    isDefaultMask &&
    removeNonDigits(phone).length < defaultMaskMinPhoneLength
  ) {
    return {
      country,
      lengthMatch: false,
      dialCodeMatch,
      areaCodeMatch,
      isValid: false,
    };
  }

  // Validate non default mask
  if (!isDefaultMask && maskPart.length !== countryMask.length) {
    return {
      country,
      lengthMatch: false,
      dialCodeMatch,
      areaCodeMatch,
      isValid: false,
    };
  }

  // Validate mask content
  for (let i = 0; i < maskPart.length; i += 1) {
    if (maskPart[i] !== countryMask[i] && countryMask[i] !== MASK_CHAR) {
      return {
        country,
        lengthMatch: false,
        dialCodeMatch,
        areaCodeMatch,
        isValid: false,
      };
    }
  }

  return {
    country,
    lengthMatch: true,
    dialCodeMatch,
    areaCodeMatch,
    isValid: areaCodeMatch ?? true,
  };
};
