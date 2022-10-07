import React, { useCallback, useEffect, useMemo } from 'react';

import { CountryGuessResult, CountryIso2, RequiredType } from '../types';
import {
  applyMask,
  getCountry,
  guessCountryByPartialNumber,
  insertChar,
  removeNonDigits,
} from '../utils';
import { useHistoryState } from './useHistoryState';
import { useTimer } from './useTimer';

export interface UsePhoneConfig {
  prefix?: string;
  maskChar?: string;
  insertSpaceAfterDialCode?: boolean;
  maxLength?: number;
  historySaveDebounceMS?: number;
  country?: CountryIso2; // no default value
  inputRef?: React.RefObject<HTMLInputElement>; // no default value
  onCountryGuess?: (data: RequiredType<CountryGuessResult>) => void;
}

const defaultPhoneConfig: Required<
  Omit<UsePhoneConfig, 'inputRef' | 'country' | 'onCountryGuess'>
> = {
  prefix: '+',
  maskChar: '.',
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
    onCountryGuess,
  } = {
    ...defaultPhoneConfig,
    ...config,
  };
  const timer = useTimer();

  const [phone, setPhone, undo, redo] = useHistoryState(value);

  const rawPhone = useMemo(() => {
    return removeNonDigits(phone);
  }, [phone]);

  const passedCountry = useMemo(() => {
    if (!country) return;
    return getCountry(country, 'iso2');
  }, [country]);

  // Set dial code to phone's beginning
  const setDialCode = useCallback(() => {
    if (!passedCountry) return;

    const dialCodeWithPrefix = `${prefix}${passedCountry.dialCode}${
      insertSpaceAfterDialCode ? ' ' : ''
    }`;
    if (phone.startsWith(dialCodeWithPrefix)) return;
    setPhone(dialCodeWithPrefix, { overrideLastHistoryItem: true });
  }, [insertSpaceAfterDialCode, passedCountry, phone, prefix, setPhone]);

  const onCountryChange = useCallback(() => {
    setDialCode();
  }, [setDialCode]);

  useEffect(() => {
    onCountryChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  // Handle undo/redo events
  useEffect(() => {
    const input = inputRef?.current;
    if (!input) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const ctrlPressed = e.ctrlKey;
      const shiftPressed = e.shiftKey;
      const zPressed = e.key.toLowerCase() === 'z';

      if (!ctrlPressed || !zPressed) return;
      return shiftPressed ? redo() : undo();
    };

    input?.addEventListener('keydown', onKeyDown);
    return () => {
      input?.removeEventListener('keydown', onKeyDown);
    };
  }, [inputRef, undo, redo]);

  /**
   * Phone value creation flow:
   * 1. Remove non digit chars from provided value
   * 2. Add prefix to value
   * 3. Apply country mask
   * 4. Insert space after dial code
   */
  const formatPhone = (
    value: string,
    config: { isDeletion: boolean },
  ): { phone: string; countryGuessResult?: CountryGuessResult } => {
    let phoneValue = value;

    if (!phoneValue) {
      return { phone: value };
    }

    // should pass prefix input
    if (phoneValue !== prefix) {
      phoneValue = removeNonDigits(phoneValue);
    }

    if (phoneValue.length > maxLength) {
      return { phone: value };
    }

    const shouldStartWithPrefix = true;

    if (shouldStartWithPrefix && phoneValue[0] !== prefix) {
      phoneValue = `${prefix}${phoneValue}`;
    }

    const countryGuessResult = guessCountryByPartialNumber(phoneValue);
    const guessedCountry = countryGuessResult?.country;

    if (guessedCountry && guessedCountry.format) {
      phoneValue = applyMask({
        value: phoneValue,
        mask: guessedCountry.format,
        maskSymbol: maskChar,
        offset: guessedCountry.dialCode.length + prefix.length,
        trimNonMaskCharsLeftover: config.isDeletion, // trim values if user deleting chars (delete mask's whitespace and brackets)
      });
    }

    if (insertSpaceAfterDialCode && guessedCountry) {
      phoneValue = insertChar({
        value: phoneValue,
        position: prefix.length + guessedCountry.dialCode.length,
        char: ' ',
      });
    }

    if (config.isDeletion) {
      phoneValue = phoneValue.trim();
    }

    return { phone: phoneValue, countryGuessResult };
  };

  const handlePhoneValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): string => {
    e.preventDefault();

    // Didn't find out how to properly type it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputType: string = (e.nativeEvent as any).inputType;
    const isDeletion = inputType.toLocaleLowerCase().includes('delete');

    const { phone, countryGuessResult } = formatPhone(e.target.value, {
      isDeletion,
    });

    const msAfterLastChange = timer.check();
    const overrideLastHistoryItem = msAfterLastChange
      ? msAfterLastChange < historySaveDebounceMS
      : false;

    setPhone(phone, { overrideLastHistoryItem });

    if (
      countryGuessResult?.country &&
      countryGuessResult.country.name !== country
    ) {
      onCountryGuess?.(countryGuessResult as RequiredType<CountryGuessResult>);
    }

    return phone;
  };

  return {
    phone,
    rawPhone,
    handlePhoneValueChange,
  };
};
