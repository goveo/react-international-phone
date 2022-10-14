import { applyMask, insertChar, removeNonDigits } from '../common';

export interface FormatPhoneConfig {
  prefix: string;
  dialCode: string;
  mask: string;
  maskChar: string;
  /**
   * Passed value will set after dial code
   */
  charAfterDialCode?: string;
  /**
   * Ignore validation of dial code
   * Passed value will always be set after hardcoded dial code
   */
  forceDialCode?: boolean;
  /**
   * @description
   * Result will not include passed *dialCode* and *prefix* if set to *true*.
   * Passed value will not process dial code if it's included in provided value.
   * Result will be the same as with *forceDialCode* option but without prefix and dial code on start
   *
   * provided *forceDialCode* value will be ignored and set to *false*
   */
  disableDialCodeAndPrefix?: boolean;
  /**
   * Trim all non-digit values from the end of the result
   */
  trimNonDigitsEnd?: boolean;
  /**
   * Insert prefix and dial code if provided empty value
   */
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
  const shouldForceDialCode = config.disableDialCodeAndPrefix
    ? false
    : config.forceDialCode;

  const shouldInsertDialCodeOnEmpty = config.disableDialCodeAndPrefix
    ? false
    : config.insertDialCodeOnEmpty;

  let phoneValue = phone;

  const onlyDigits = removeNonDigits(phoneValue);

  if (!phoneValue) {
    if (
      (shouldInsertDialCodeOnEmpty && !phoneValue.length) ||
      (shouldForceDialCode && onlyDigits.length <= config.dialCode.length)
    ) {
      return `${config.prefix}${config.dialCode}${config.charAfterDialCode}`;
    }

    return phoneValue;
  }

  // 1. Remove non digit chars from provided value
  phoneValue = onlyDigits;

  if (shouldForceDialCode && !phoneValue.startsWith(config.dialCode)) {
    phoneValue = `${config.dialCode}${phoneValue}`;
  }

  if (!config.disableDialCodeAndPrefix) {
    // 2. Add prefix to value
    phoneValue = `${config.prefix}${phoneValue}`;
  }

  // 3. Apply country mask
  phoneValue = applyMask({
    value: phoneValue,
    mask: config.mask,
    maskSymbol: config.maskChar,
    offset: config.disableDialCodeAndPrefix
      ? 0
      : config.dialCode.length + config.prefix.length,
    trimNonMaskCharsLeftover: config.trimNonDigitsEnd,
  });

  if (config.charAfterDialCode && !config.disableDialCodeAndPrefix) {
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
