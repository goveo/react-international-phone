import { defaultPhoneConfig, MASK_CHAR } from '../../hooks/usePhone';
import { CountryData, ParsedCountry } from '../../types';
import { removeNonDigits } from '../common';
import { guessCountryByPartialNumber } from '../countryUtils';

export interface ValidatePhoneConfig {
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
    ...defaultPhoneConfig,
    ...config,
  };

  const { country, fullDialCodeMatch, areaCodeMatch } =
    guessCountryByPartialNumber({
      phone,
      countries,
    });

  // Handle non-existent dial code
  if (!country || !fullDialCodeMatch) {
    return {
      country: undefined,
      lengthMatch: false,
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
      areaCodeMatch,
      isValid: false,
    };
  }

  // Validate non default mask
  if (!isDefaultMask && maskPart.length !== countryMask.length) {
    return {
      country,
      lengthMatch: false,
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
        areaCodeMatch,
        isValid: false,
      };
    }
  }

  return {
    country,
    lengthMatch: true,
    areaCodeMatch,
    isValid: areaCodeMatch ?? true,
  };
};
