import React, { useEffect, useMemo } from "react";
import { CountryName } from "../types";
import {
  applyMask,
  guessCountryByPartialNumber,
  insertChar,
  removeNonDigits,
} from "../utils";
import { getCountry } from "../utils/countryUtils/getCountry";
import { useHistoryState } from "./useHistoryState";
import { useTimer } from "./useTimer";

export interface UsePhoneConfig {
  prefix?: string;
  maskChar?: string;
  insertSpaceAfterDialCode?: boolean;
  maxLength?: number;
  historySaveDebounceMS?: number;
  country?: CountryName; // no default value
  inputRef?: React.RefObject<HTMLInputElement>; // no default value
}

const defaultPhoneConfig: Required<
  Omit<UsePhoneConfig, "inputRef" | "country">
> = {
  prefix: "+",
  maskChar: ".",
  insertSpaceAfterDialCode: true,
  maxLength: 15,
  historySaveDebounceMS: 200,
};

export const usePhone = (value: string, config?: UsePhoneConfig) => {
  const {
    country,
    prefix,
    maskChar,
    insertSpaceAfterDialCode,
    maxLength,
    historySaveDebounceMS,
    inputRef,
  } = {
    ...defaultPhoneConfig,
    ...config,
  };

  const [phone, setPhone, undo, redo] = useHistoryState(value);

  const rawPhone = useMemo(() => {
    return removeNonDigits(phone);
  }, [phone]);

  const passedCountry = useMemo(() => {
    if (!country) return;
    return getCountry(country, "name");
  }, [country]);

  // Force country dial code (if country provided)
  useEffect(() => {
    if (passedCountry) {
      const dialCodeWithPrefix = `${prefix}${passedCountry.dialCode}${
        insertSpaceAfterDialCode ? " " : ""
      }`;
      if (phone.startsWith(dialCodeWithPrefix)) return;
      setPhone(dialCodeWithPrefix, { overrideLastHistoryItem: true });
    }
  }, [insertSpaceAfterDialCode, passedCountry, phone, prefix, setPhone]);

  const timer = useTimer();

  // Handle undo/redo events
  useEffect(() => {
    const input = inputRef?.current;
    if (!input) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const ctrlPressed = e.ctrlKey;
      const shiftPressed = e.shiftKey;
      const zPressed = e.key.toLowerCase() === "z";

      if (!ctrlPressed || !zPressed) return;
      return shiftPressed ? redo() : undo();
    };

    input?.addEventListener("keydown", onKeyDown);
    return () => {
      input?.removeEventListener("keydown", onKeyDown);
    };
  }, [inputRef, undo, redo]);

  const handlePhoneValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    // Didn't find out how to properly type it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputType: string = (e.nativeEvent as any).inputType;
    const isDeletion = inputType.toLocaleLowerCase().includes("delete");

    let phoneValue = e.target.value;

    const currentCountry = guessCountryByPartialNumber(phoneValue);

    if (!phoneValue) {
      return setPhone(phoneValue);
    }

    // should pass prefix input
    if (phoneValue !== prefix) {
      phoneValue = removeNonDigits(phoneValue);
    }

    if (phoneValue.length > maxLength) {
      return;
    }

    const shouldStartWithPrefix = true;

    if (shouldStartWithPrefix && phoneValue[0] !== prefix) {
      phoneValue = `${prefix}${phoneValue}`;
    }

    if (currentCountry && currentCountry.format) {
      phoneValue = applyMask({
        value: phoneValue,
        mask: currentCountry.format,
        maskSymbol: maskChar,
        offset: currentCountry.dialCode.length + prefix.length,
        trimNonMaskCharsLeftover: isDeletion, // trim values if user deleting chars (delete mask's whitespace and brackets)
      });
    }

    if (insertSpaceAfterDialCode && currentCountry) {
      phoneValue = insertChar({
        value: phoneValue,
        position: prefix.length + currentCountry.dialCode.length,
        char: " ",
      });
    }

    phoneValue = phoneValue.trim();

    const msAfterLastChange = timer.check();
    const overrideLastHistoryItem = msAfterLastChange
      ? msAfterLastChange < historySaveDebounceMS
      : false;

    setPhone(phoneValue, { overrideLastHistoryItem });
  };

  return {
    phone,
    rawPhone,
    handlePhoneValueChange,
  };
};
