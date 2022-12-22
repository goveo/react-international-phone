import { useEffect, useMemo, useState } from 'react';

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
import { useHistoryState } from './useHistoryState';
import { useTimer } from './useTimer';

interface FormatPhoneValueFuncOptions {
  trimNonDigitsEnd?: boolean;
  insertDialCodeOnEmpty?: boolean;
  forceDisableCountryGuess?: boolean;
}

interface HandleValueChangeFuncOptions {
  deletion?: 'forward' | 'backward' | undefined;
  cursorPosition?: number;
  insertDialCodeOnEmpty?: boolean;
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
   * @description Char that renders after dial code
   * @default " "
   */
  charAfterDialCode?: string;

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
   * @description Callback that calls on country guess
   * @param data country guess result (includes *country* and *isFullMatch*)
   * @default undefined
   */
  onCountryGuess?: (data: RequiredType<CountryGuessResult>) => void;

  /**
   * @description Callback that calls on phone update (helpful for cursor handling)
   * @param phone new phone value
   * @param metadata helpful data for handling update
   * @default undefined
   */
  onPhoneUpdate?: (
    phone: string,
    metadata: {
      formatCountry: ParsedCountry | undefined;
      unformattedValue: string;
      cursorPosition: number;
      deletion: HandleValueChangeFuncOptions['deletion'];
    },
  ) => void;
}

// On change: make sure to update these values in stories
const defaultPhoneConfig: Required<
  Omit<
    UsePhoneConfig,
    'inputRef' | 'country' | 'onCountryGuess' | 'onPhoneUpdate'
  > // omit props with no default value
> = {
  prefix: '+',
  defaultMask: '............', // 12 chars
  charAfterDialCode: ' ',
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
    charAfterDialCode,
    historySaveDebounceMS,
    disableCountryGuess,
    disableDialCodePrefill,
    forceDialCode,
    disableDialCodeAndPrefix,
    onCountryGuess,
    onPhoneUpdate,
  } = {
    ...defaultPhoneConfig,
    ...config,
  };
  const shouldGuessCountry = disableDialCodeAndPrefix
    ? false
    : !disableCountryGuess;

  const timer = useTimer();

  const passedCountry = useMemo(() => {
    if (!country) return;
    return getCountry({
      value: country,
      field: 'iso2',
      countries: countryData,
    });
  }, [country, countryData]);

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
  const [initialized, setInitialized] = useState(false);

  const handleValueChange = (
    newPhone: string,
    {
      deletion,
      cursorPosition,
      insertDialCodeOnEmpty,
    }: HandleValueChangeFuncOptions = {},
  ): string => {
    const {
      phone: phoneValue,
      countryGuessResult,
      formatCountry,
    } = formatPhoneValue(newPhone, {
      trimNonDigitsEnd: deletion === 'backward', // trim values if user deleting chars (delete mask's whitespace and brackets)
      insertDialCodeOnEmpty:
        insertDialCodeOnEmpty || (!initialized && !disableDialCodePrefill),
      forceDisableCountryGuess:
        forceDialCode &&
        !!deletion &&
        removeNonDigits(newPhone).length <
          (passedCountry?.dialCode.length ?? 0),
    });

    const timePassedSinceLastChange = timer.check();
    const historySaveDebounceTimePassed = timePassedSinceLastChange
      ? timePassedSinceLastChange > historySaveDebounceMS
      : true;

    setPhone(phoneValue, {
      overrideLastHistoryItem: !historySaveDebounceTimePassed,
    });

    onPhoneUpdate?.(phoneValue, {
      formatCountry,
      unformattedValue: newPhone,
      cursorPosition: cursorPosition ?? 0,
      deletion,
    });

    if (
      shouldGuessCountry &&
      countryGuessResult?.country &&
      countryGuessResult.country.name !== country
    ) {
      onCountryGuess?.(countryGuessResult as RequiredType<CountryGuessResult>);
    }

    if (!initialized) {
      setInitialized(true);
    }

    return phoneValue;
  };

  // Handle value update
  useEffect(() => {
    if (initialized && value === phone) return;
    handleValueChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return {
    phone,
    initialized,
    undo,
    redo,
    handleValueChange,
  };
};
