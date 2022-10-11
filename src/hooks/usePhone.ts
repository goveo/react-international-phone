import React, { useCallback, useEffect, useMemo } from 'react';

import { CountryGuessResult, CountryIso2, RequiredType } from '../types';
import {
  formatPhone,
  getCountry,
  guessCountryByPartialNumber,
  removeNonDigits,
} from '../utils';
import { useHistoryState } from './useHistoryState';
import { useTimer } from './useTimer';

export interface UsePhoneConfig {
  prefix?: string;
  defaultMask?: string;
  maskChar?: string;
  insertSpaceAfterDialCode?: boolean;
  historySaveDebounceMS?: number;
  country?: CountryIso2;
  inputRef?: React.RefObject<HTMLInputElement>;
  onCountryGuess?: (data: RequiredType<CountryGuessResult>) => void;
}

// On change: make sure to update these values in stories
const defaultPhoneConfig: Required<
  Omit<UsePhoneConfig, 'inputRef' | 'country' | 'onCountryGuess'> // omit props with no default value
> = {
  prefix: '+',
  defaultMask: '............', // 12 chars
  maskChar: '.',
  insertSpaceAfterDialCode: true,
  historySaveDebounceMS: 200,
};

export const usePhone = (value: string, config?: UsePhoneConfig) => {
  const {
    country,
    prefix,
    defaultMask,
    maskChar,
    insertSpaceAfterDialCode,
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

  const handlePhoneValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): string => {
    e.preventDefault();

    // Didn't find out how to properly type it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputType: string = (e.nativeEvent as any).inputType;
    const isDeletion = inputType.toLocaleLowerCase().includes('delete');

    const value = e.target.value;

    // FIXME: should not guess country on every change
    const countryGuessResult = guessCountryByPartialNumber(value);
    const guessedCountry = countryGuessResult?.country;

    const phone = formatPhone(e.target.value, {
      prefix,
      mask: guessedCountry?.format ?? defaultMask,
      maskChar,
      dialCode: guessedCountry?.dialCode,
      // trim values if user deleting chars (delete mask's whitespace and brackets)
      trimNonDigitsEnd: isDeletion,
      charAfterDialCode: insertSpaceAfterDialCode ? ' ' : '',
    });

    const historySaveDebounceTimePassed =
      (timer.check() ?? -1) < historySaveDebounceMS;

    setPhone(phone, { overrideLastHistoryItem: historySaveDebounceTimePassed });

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
