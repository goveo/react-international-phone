import React, { useEffect, useMemo, useState } from "react";
import { ParsedCountry } from "../types";
import {
  applyMask,
  guessCountryByPartialNumber,
  insertChar,
  removeNonDigits,
} from "../utils";
import { useHistoryState } from "./useHistoryState";
import { useTimer } from "./useTimer";

export interface UsePhoneConfig {
  prefix?: string;
  maskChar?: string;
  insertSpaceAfterDialCode?: boolean;
  maxLength?: number;
  historySaveDebounceMS?: number;
  inputRef?: React.RefObject<HTMLInputElement>;
}

const defaultPhoneConfig: Required<Omit<UsePhoneConfig, "inputRef">> = {
  prefix: "+",
  maskChar: ".",
  insertSpaceAfterDialCode: true,
  maxLength: 15,
  historySaveDebounceMS: 200,
};

export const usePhone = (value: string, config?: UsePhoneConfig) => {
  const {
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

  const [selectedCountry, setSelectedCountry] = useState<
    ParsedCountry | undefined
  >();

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

  const rawPhone = useMemo(() => {
    return removeNonDigits(phone);
  }, [phone]);

  const handlePhoneValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    // Didn't find out how to properly type it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputType: string = (e.nativeEvent as any).inputType;
    const isDeletion = inputType.toLocaleLowerCase().includes("delete");

    let newValue = e.target.value;

    const guessedCountry = guessCountryByPartialNumber(newValue);
    setSelectedCountry(guessedCountry);

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
        trimNonMaskCharsLeftover: isDeletion, // trim values if user deleting chars (delete mask's whitespace and brackets)
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

    const msAfterLastChange = timer.check();
    const overrideLastHistoryItem = msAfterLastChange
      ? msAfterLastChange < historySaveDebounceMS
      : false;

    setPhone(newValue, { overrideLastHistoryItem });
  };

  return {
    phone,
    rawPhone,
    handlePhoneValueChange,
    selectedCountry,
  };
};
