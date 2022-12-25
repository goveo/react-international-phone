import { defaultPhoneConfig, MASK_CHAR } from '../../hooks/usePhone';
import { CountryData, ParsedCountry } from '../../types';
import { guessCountryByPartialNumber } from '../countryUtils';

export interface ValidatePhoneConfig {
  /**
   * Custom countries list
   */
  countries?: CountryData[];

  prefix?: string;
  charAfterDialCode?: string;
  defaultMask?: string;
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
  const { countries, defaultMask, prefix, charAfterDialCode } = {
    ...defaultPhoneConfig,
    ...config,
  };

  const { country, fullDialCodeMatch, areaCodeMatch } =
    guessCountryByPartialNumber({
      phone,
      countries,
    });

  if (!country || !fullDialCodeMatch) {
    return {
      country: undefined,
      lengthMatch: false,
      areaCodeMatch,
      isValid: false,
    };
  }

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
  const countryMask = country.format ?? defaultMask;

  if (maskPart.length !== countryMask.length) {
    return {
      country,
      lengthMatch: false,
      areaCodeMatch,
      isValid: false,
    };
  }

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
