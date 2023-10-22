import { MASK_CHAR } from '../../hooks/usePhoneInput';
import { ParsedCountry } from '../../types';
import { removeNonDigits } from '../common';

/**
 * Get the country mask format based on the phone value.
 * Since country can have multiple mask formats this function select proper mask based on regex
 */
export const getActiveFormattingMask = ({
  phone,
  country,
  defaultMask = '............', // 12 chars
  disableFormatting = false,
}: {
  phone: string;
  country: ParsedCountry;
  /**
   * defaultMask is returned when country's format is undefined or not valid
   */
  defaultMask?: string;
  disableFormatting?: boolean;
}): string => {
  const format = country.format;

  const handleReturn = (mask: string) => {
    return disableFormatting
      ? mask.replace(new RegExp(`[^${MASK_CHAR}]`, 'g'), '') // remove non MASK_CHAR symbols
      : mask;
  };

  if (!format) {
    return handleReturn(defaultMask);
  }

  if (typeof format === 'string') {
    return handleReturn(format);
  }

  if (!format['default']) {
    console.error(
      `[react-international-phone]: default mask for ${country.iso2} is not provided`,
    );
    return handleReturn(defaultMask);
  }

  // format is object value -> parse key regex and get format string
  const matchedFormatKey = Object.keys(format).find((key) => {
    if (key === 'default') return false; // ignore default key

    const isValidRegex =
      key.charAt(0) === '/' && key.charAt(key.length - 1) === '/';

    if (!isValidRegex) {
      console.error(
        `[react-international-phone]: format regex "${key}" for ${country.iso2} is not valid`,
      );
      return false;
    }

    // trim first and last symbols (to pass raw regex value to constructor)
    const regex = new RegExp(key.substring(1, key.length - 1));
    const valueWithoutDialCode = phone.replace(country.dialCode, '');

    return regex.test(removeNonDigits(valueWithoutDialCode));
  });

  return handleReturn(
    matchedFormatKey ? format[matchedFormatKey] : format['default'],
  );
};
