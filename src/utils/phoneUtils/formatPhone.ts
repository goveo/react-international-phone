import { applyMask, insertChar, removeNonDigits } from '../common';

export interface FormatPhoneConfig {
  prefix: string;
  charAfterDialCode: string;
  mask?: string;
  maskChar: string;
  dialCode?: string;
  trimNonDigitsEnd: boolean;
}

/**
 * Phone formatting flow:
 * 1. Remove non digit chars from provided value
 * 2. Add prefix to value
 * 3. Apply country mask
 * 4. Insert char after dial code
 */
export const formatPhone = (
  phone: string,
  config: FormatPhoneConfig,
): string => {
  let phoneValue = phone;

  if (!phoneValue) {
    return phoneValue;
  }

  // 1. Remove non digit chars from provided value
  phoneValue = removeNonDigits(phoneValue);

  // 2. Add prefix to value
  phoneValue = `${config.prefix}${phoneValue}`;

  if (config.mask && config.dialCode) {
    // 3. Apply country mask
    phoneValue = applyMask({
      value: phoneValue,
      mask: config.mask,
      maskSymbol: config.maskChar,
      offset: config.dialCode.length + config.prefix.length,
      trimNonMaskCharsLeftover: config.trimNonDigitsEnd,
    });
  }

  if (config.charAfterDialCode && config.dialCode) {
    // 4. Insert char after dial code
    phoneValue = insertChar({
      value: phoneValue,
      position: config.prefix.length + config.dialCode.length,
      char: config.charAfterDialCode,
    });
  }

  if (config.trimNonDigitsEnd) {
    phoneValue = phoneValue.trim();
  }

  return phoneValue;
};
