import React, { useEffect, useMemo } from 'react';

import { defaultCountries } from '../data/countryData';
import {
  CountryData,
  CountryGuessResult,
  CountryIso2,
  ParsedCountry,
  RequiredType,
} from '../types';
import {
  formatPhone,
  getCountry,
  guessCountryByPartialNumber,
  removeNonDigits,
} from '../utils';
import { getCursorPosition } from '../utils/phoneUtils/getCursorPosition';
import { useHistoryState } from './useHistoryState';
import { usePrevious } from './usePrevious';
import { useTimer } from './useTimer';

interface FormatPhoneValueFuncOptions {
  trimNonDigitsEnd?: boolean;
  insertDialCodeOnEmpty?: boolean;
  forceDisableCountryGuess?: boolean;
}

const MASK_CHAR = '.';

export interface UsePhoneConfig {
  /**
   * @description Prefix for phone value.
   * @default "+"
   */
  prefix?: string;

  /**
   * @description This mask will apply on countries that does not have specified mask.
   * @default "............" // 12 chars
   */
  defaultMask?: string;

  /**
   * @description Hide space after country dial code
   * @default false
   */
  hideSpaceAfterDialCode?: boolean;

  /**
   * @description
   * Save value to history if there were not any changes in provided milliseconds timeslot.
   * Undo/redo (ctrl+z/ctrl+shift+z) works only with values that are saved in history.
   * @default 200
   */
  historySaveDebounceMS?: number;

  /**
   * @description Disable country guess on value change.
   * @ignore
   * *onCountryGuess* callback would not be called
   * @default false
   */
  disableCountryGuess?: boolean;

  /**
   * @description
   * Disable dial code prefill on initialization.
   * Dial code prefill works only when "empty" phone value have been provided.
   * @default false
   */
  disableDialCodePrefill?: boolean;

  /**
   * @description
   * Always display the dial code.
   * Dial code can't be removed/changed by keyboard events, but it can be changed by pasting another country phone value.
   * @default false
   */
  forceDialCode?: boolean;

  /**
   * @description Phone value will not include passed *dialCode* and *prefix* if set to *true*.
   * @ignore
   * - *disableCountryGuess* value will be ignored and set to *true*.
   * - *forceDialCode* value will be ignored and set to *false*.
   * @default false
   */
  disableDialCodeAndPrefix?: boolean;

  /**
   * @description Selected country (iso2)
   * @default undefined
   */
  country?: CountryIso2;

  /**
   * @description Array of available countries for guessing
   * @default defaultCountries // full country list
   */
  countries?: CountryData[];

  /**
   * @description
   * Input's ref.
   * Allows handling redo/undo using keyboard events.
   * Allows handling input cursor position.
   * @default undefined
   */
  inputRef?: React.RefObject<HTMLInputElement>;

  /**
   * @description Callback that calls on country guess
   * @params country guess result (includes *country* and *isFullMatch*)
   * @default undefined
   */
  onCountryGuess?: (data: RequiredType<CountryGuessResult>) => void;
}

// On change: make sure to update these values in stories
const defaultPhoneConfig: Required<
  Omit<UsePhoneConfig, 'inputRef' | 'country' | 'onCountryGuess'> // omit props with no default value
> = {
  prefix: '+',
  defaultMask: '............', // 12 chars
  hideSpaceAfterDialCode: false,
  historySaveDebounceMS: 200,
  disableCountryGuess: false,
  disableDialCodePrefill: false,
  forceDialCode: false,
  disableDialCodeAndPrefix: false,
  countries: defaultCountries,
};

export const usePhone = (value: string, config?: UsePhoneConfig) => {
  const {
    country,
    countries: countryData,
    prefix,
    defaultMask,
    hideSpaceAfterDialCode,
    historySaveDebounceMS,
    disableCountryGuess,
    disableDialCodePrefill,
    forceDialCode,
    disableDialCodeAndPrefix,
    inputRef,
    onCountryGuess,
  } = {
    ...defaultPhoneConfig,
    ...config,
  };
  const charAfterDialCode = hideSpaceAfterDialCode ? '' : ' ';
  const shouldGuessCountry = disableDialCodeAndPrefix
    ? false
    : !disableCountryGuess;

  const timer = useTimer();

  const passedCountry = useMemo(() => {
    if (!country) return;
    return getCountry({
      value: country,
      field: 'iso2',
      countries: defaultCountries,
    });
  }, [country]);

  const prevPassedCountry = usePrevious(passedCountry);

  const formatPhoneValue = (
    value: string,
    {
      trimNonDigitsEnd,
      insertDialCodeOnEmpty,
      forceDisableCountryGuess,
    }: FormatPhoneValueFuncOptions,
  ): {
    phone: string;
    countryGuessResult?: CountryGuessResult | undefined;
    formatCountry?: ParsedCountry | undefined;
  } => {
    const countryGuessResult =
      !forceDisableCountryGuess && shouldGuessCountry
        ? guessCountryByPartialNumber({
            phone: value,
            countries: countryData,
          }) // FIXME: should not guess country on every change
        : undefined;

    const formatCountry =
      !forceDisableCountryGuess && shouldGuessCountry
        ? countryGuessResult?.country ?? passedCountry
        : passedCountry;

    const phone = formatCountry
      ? formatPhone(value, {
          prefix,
          mask: formatCountry.format ?? defaultMask,
          maskChar: MASK_CHAR,
          dialCode: formatCountry.dialCode,
          trimNonDigitsEnd,
          charAfterDialCode,
          forceDialCode,
          insertDialCodeOnEmpty,
          disableDialCodeAndPrefix,
        })
      : value;

    return { phone, countryGuessResult, formatCountry };
  };

  const [phone, setPhone, undo, redo] = useHistoryState('');

  // set initial phone value
  useEffect(() => {
    setPhone(
      formatPhoneValue(value, {
        trimNonDigitsEnd: false,
        insertDialCodeOnEmpty: !disableDialCodePrefill,
      }).phone,
      {
        overrideLastHistoryItem: true,
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rawPhone = useMemo(() => {
    return removeNonDigits(phone);
  }, [phone]);

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

  // on country change
  useEffect(() => {
    if (!passedCountry || !prevPassedCountry) return; // initial render

    if (
      guessCountryByPartialNumber({
        phone: rawPhone,
        countries: countryData,
      }).country?.dialCode !== passedCountry.dialCode
    ) {
      // country was updated with country-selector (not from input)
      const phoneValue = disableDialCodeAndPrefix
        ? ''
        : `${prefix}${passedCountry.dialCode}${charAfterDialCode}`;
      return setPhone(phoneValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  const handlePhoneValueChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): string => {
    e.preventDefault();

    // Didn't find out how to properly type it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputType: string | undefined = (e.nativeEvent as any).inputType;
    const isDeletion =
      inputType?.toLocaleLowerCase().includes('delete') ?? false;

    const value = e.target.value;

    const {
      phone: phoneValue,
      countryGuessResult,
      formatCountry,
    } = formatPhoneValue(value, {
      trimNonDigitsEnd: isDeletion, // trim values if user deleting chars (delete mask's whitespace and brackets)
      insertDialCodeOnEmpty: false,
      forceDisableCountryGuess:
        forceDialCode &&
        isDeletion &&
        removeNonDigits(value).length < (passedCountry?.dialCode.length ?? 0),
    });

    const timePassedSinceLastChange = timer.check();
    const historySaveDebounceTimePassed = timePassedSinceLastChange
      ? timePassedSinceLastChange > historySaveDebounceMS
      : true;

    setPhone(phoneValue, {
      overrideLastHistoryItem: !historySaveDebounceTimePassed,
    });

    if (inputRef?.current) {
      const cursorPosition = getCursorPosition({
        cursorPositionAfterInput:
          inputRef.current.selectionStart ?? phone.length,
        phoneBeforeInput: phone,
        phoneAfterInput: value,
        phoneAfterFormatted: phoneValue,
        leftOffset: forceDialCode
          ? prefix.length + (formatCountry?.dialCode?.length ?? 0)
          : 0,
      });

      /**
       * HACK: should set cursor on the next tick to make sure that the phone value is updated
       * useTimeout with 0ms provides issues when two keys are pressed same time
       */
      Promise.resolve().then(() => {
        inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
      });
    }

    if (
      shouldGuessCountry &&
      countryGuessResult?.country &&
      countryGuessResult.country.name !== country
    ) {
      onCountryGuess?.(countryGuessResult as RequiredType<CountryGuessResult>);
    }

    return phoneValue;
  };

  return {
    phone,
    rawPhone,
    handlePhoneValueChange,
  };
};
