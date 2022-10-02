import { useMemo, useState } from "react";
import {
  applyMask,
  guessCountryByPartialNumber,
  insertChar,
  removeNonDigits,
} from "../utils";

export interface UsePhoneConfig {
  prefix?: string;
  maskChar?: string;
  insertSpaceAfterDialCode?: boolean;
  maxLength?: number;
}

const defaultPhoneConfig = {
  prefix: "+",
  maskChar: ".",
  insertSpaceAfterDialCode: true,
  maxLength: 15,
};

export const usePhone = (value: string, config?: UsePhoneConfig) => {
  const { prefix, maskChar, insertSpaceAfterDialCode, maxLength } = {
    ...defaultPhoneConfig,
    ...config,
  };

  const [phone, setPhone] = useState(value);

  const rawPhone = useMemo(() => {
    return removeNonDigits(phone);
  }, [phone]);

  const guessedCountry = useMemo(() => {
    return guessCountryByPartialNumber(phone);
  }, [phone]);

  const updatePhone = (newValue: string) => {
    if (!newValue) {
      return setPhone(newValue);
    }

    // should pass prefix input
    if (newValue !== prefix) {
      newValue = removeNonDigits(newValue);
    }

    if (newValue.length > maxLength) {
      return;
    }

    const shouldStartWithPrefix = true;

    if (shouldStartWithPrefix && newValue[0] !== prefix) {
      newValue = `${prefix}${newValue}`;
    }

    if (guessedCountry && guessedCountry.format) {
      newValue = applyMask({
        value: newValue,
        mask: guessedCountry.format,
        maskSymbol: maskChar,
        offset: guessedCountry.dialCode.length + prefix.length,
      });
    }

    if (insertSpaceAfterDialCode && guessedCountry) {
      const insertPosition = prefix.length + guessedCountry.dialCode.length;

      newValue = insertChar({
        value: newValue,
        position: insertPosition,
        char: " ",
      });
    }

    newValue = newValue.trim();

    setPhone(newValue);
  };

  return {
    phone,
    rawPhone,
    updatePhone,
    guessedCountry,
  };
};
