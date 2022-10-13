import { applyMask, insertChar, removeNonDigits } from '../common';

export interface FormatPhoneConfig {
  prefix: string;
  dialCode: string;
  mask: string;
  maskChar: string;
  charAfterDialCode?: string;
  forceDialCode?: boolean;
  trimNonDigitsEnd?: boolean;
  insertDialCodeOnEmpty?: boolean;
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

  const onlyDigits = removeNonDigits(phoneValue);

  if (!phoneValue) {
    if (
      (config.insertDialCodeOnEmpty && !phoneValue.length) ||
      (config.forceDialCode && onlyDigits.length <= config.dialCode.length)
    ) {
      return `${config.prefix}${config.dialCode}${config.charAfterDialCode}`;
    }

    return phoneValue;
  }

  // 1. Remove non digit chars from provided value
  phoneValue = onlyDigits;

  if (config.forceDialCode && !phoneValue.startsWith(config.dialCode)) {
    phoneValue = `${config.dialCode}${phoneValue}`;
  }

  // 2. Add prefix to value
  phoneValue = `${config.prefix}${phoneValue}`;

  // 3. Apply country mask
  phoneValue = applyMask({
    value: phoneValue,
    mask: config.mask,
    maskSymbol: config.maskChar,
    offset: config.dialCode.length + config.prefix.length,
    trimNonMaskCharsLeftover: config.trimNonDigitsEnd,
  });

  if (config.charAfterDialCode) {
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
