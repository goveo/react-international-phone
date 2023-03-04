import { useEffect, useMemo, useRef, useState } from 'react';

import { defaultCountries } from '../data/countryData';
import {
  CountryData,
  CountryGuessResult,
  CountryIso2,
  ParsedCountry,
} from '../types';
import {
  addDialCode,
  formatPhone,
  getCountry,
  getCursorPosition,
  guessCountryByPartialNumber,
  removeNonDigits,
} from '../utils';
import { useHistoryState } from './useHistoryState';
import { useTimer } from './useTimer';

interface FormatPhoneValueFuncOptions {
  trimNonDigitsEnd?: boolean;
  insertDialCodeOnEmpty?: boolean;
  forceDisableCountryGuess?: boolean;
  forcedCountry?: ParsedCountry;
}

type DeletionType = 'forward' | 'backward' | undefined;

interface HandleValueChangeFuncOptions {
  deletion?: DeletionType;
  inserted?: boolean;
  cursorPosition?: number;
  insertDialCodeOnEmpty?: boolean;
  forcedCountry?: ParsedCountry;
}

export const MASK_CHAR = '.';

export interface UsePhoneInputConfig {
  /**
   * @description Initial country value (iso2).
   */
  initialCountry: CountryIso2;

  /**
   * @description phone value
   */
  value?: string;

  /**
   * @description Array of available countries for guessing
   * @default defaultCountries // full country list
   */
  countries?: CountryData[];

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
   * @description Char that renders after country dial code.
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
   * @description Callback that calls on country change
   * @params *phone* - new phone value
   * @default undefined
   */
  onCountryChange?: (phone: string) => void;
}

export const defaultConfig: Required<
  Omit<UsePhoneInputConfig, 'initialCountry' | 'inputRef' | 'onCountryChange'> // omit props with no default value
> = {
  value: '',
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

export const usePhoneInput = (config: UsePhoneInputConfig) => {
  const {
    value,
    initialCountry,
    countries,
    prefix,
    defaultMask,
    charAfterDialCode,
    historySaveDebounceMS,
    disableCountryGuess,
    disableDialCodePrefill,
    forceDialCode,
    disableDialCodeAndPrefix,
    onCountryChange,
  } = {
    ...defaultConfig,
    ...config,
  };

  const countryGuessingEnabled = disableDialCodeAndPrefix
    ? false
    : !disableCountryGuess;

  const inputRef = useRef<HTMLInputElement | null>(null);
  const timer = useTimer();

  const formatPhoneValue = (
    value: string,
    {
      trimNonDigitsEnd,
      insertDialCodeOnEmpty,
      forceDisableCountryGuess,
      forcedCountry,
    }: FormatPhoneValueFuncOptions = {},
  ): {
    phone: string;
    countryGuessResult?: CountryGuessResult | undefined;
    formatCountry?: ParsedCountry | undefined;
  } => {
    const shouldGuessCountry =
      !forceDisableCountryGuess && countryGuessingEnabled && !forcedCountry;

    const countryGuessResult = shouldGuessCountry
      ? guessCountryByPartialNumber({
          phone: value,
          countries,
          currentCountryIso2: fullCountry?.iso2,
        }) // FIXME: should not guess country on every change
      : undefined;

    const formatCountry =
      forcedCountry ?? countryGuessResult?.country ?? fullCountry;

    const phone = formatCountry
      ? formatPhone(value, {
          prefix,
          mask: formatCountry.format || defaultMask,
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

  const [{ phone, country }, updateHistory, undo, redo] = useHistoryState({
    phone: formatPhoneValue(value, {
      insertDialCodeOnEmpty: !disableDialCodePrefill,
    }).phone,
    country:
      guessCountryByPartialNumber({
        phone: value,
        countries,
        currentCountryIso2: initialCountry,
      }).country?.iso2 ?? initialCountry,
  });

  const fullCountry = useMemo(() => {
    return getCountry({
      value: country,
      field: 'iso2',
      countries,
    });
  }, [countries, country]);

  const [initialized, setInitialized] = useState(false);

  const handleValueChange = (
    newPhone: string,
    {
      deletion,
      cursorPosition,
      insertDialCodeOnEmpty,
      inserted,
      forcedCountry,
    }: HandleValueChangeFuncOptions = {},
  ): string => {
    let newPhoneValue = newPhone;
    let cursorPositionAfterInput = cursorPosition;

    if (
      forceDialCode &&
      !disableDialCodeAndPrefix &&
      fullCountry &&
      // dial code has been changed
      !removeNonDigits(newPhone).startsWith(fullCountry.dialCode) &&
      // phone was not removed completely
      !!newPhone
    ) {
      // Allow dial code change when selected all (ctrl+a) and inserted new value that starts with prefix
      if (
        inserted &&
        newPhone.startsWith(prefix) &&
        // cursor position was set to 0 before the input
        newPhone.length - (cursorPosition ?? 0) === 0
      ) {
        newPhoneValue = newPhone;
      } else {
        // Prevent change of dial code and set the cursor to beginning
        // (after formatting it will be set after dial code)
        newPhoneValue = phone;
        cursorPositionAfterInput = 0;
      }
    }

    const { phone: phoneValue, countryGuessResult } = formatPhoneValue(
      newPhoneValue,
      {
        trimNonDigitsEnd: deletion === 'backward', // trim values if user deleting chars (delete mask's whitespace and brackets)
        insertDialCodeOnEmpty:
          insertDialCodeOnEmpty || (!initialized && !disableDialCodePrefill),
        forceDisableCountryGuess:
          forceDialCode &&
          !!deletion &&
          removeNonDigits(newPhoneValue).length <
            (fullCountry?.dialCode.length ?? 0),
        forcedCountry,
      },
    );

    let newCountry = fullCountry;

    if (
      countryGuessingEnabled &&
      countryGuessResult?.country &&
      countryGuessResult.country.name !== country &&
      countryGuessResult.fullDialCodeMatch
    ) {
      newCountry = countryGuessResult.country;
      onCountryChange?.(phoneValue);
    }

    if (!newCountry) {
      // Initial country is not passed, or iso code do not match
      console.error(
        '[react-international-phone]: initial country is not passed, or iso code do not match with any country',
      );
      return '';
    }

    const newCursorPosition = initialized
      ? getCursorPosition({
          cursorPositionAfterInput: cursorPositionAfterInput ?? 0,
          phoneBeforeInput: phone,
          phoneAfterInput: newPhone,
          phoneAfterFormatted: phoneValue,
          leftOffset: forceDialCode
            ? prefix.length +
              (fullCountry?.dialCode?.length ?? 0) +
              charAfterDialCode.length
            : 0,
          deletion,
        })
      : newPhone.length;

    const timePassedSinceLastChange = timer.check();
    const historySaveDebounceTimePassed = timePassedSinceLastChange
      ? timePassedSinceLastChange > historySaveDebounceMS
      : true;

    updateHistory(
      {
        phone: phoneValue,
        country: newCountry.iso2,
      },
      {
        overrideLastHistoryItem: !historySaveDebounceTimePassed,
      },
    );

    /**
     * HACK: should set cursor on the next tick to make sure that the phone value is updated
     * useTimeout with 0ms provides issues when two keys are pressed same time
     */
    Promise.resolve().then(() => {
      inputRef.current?.setSelectionRange(newCursorPosition, newCursorPosition);
    });

    if (!initialized) {
      setInitialized(true);
    }

    return phoneValue;
  };

  // Handle undo/redo events
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    const onKeyDown = (e: KeyboardEvent) => {
      // Keydown event without key property throws on autofill
      if (!e.key) return;

      const ctrlPressed = e.ctrlKey;
      const shiftPressed = e.shiftKey;
      const zPressed = e.key.toLowerCase() === 'z';

      if (!ctrlPressed || !zPressed) return;
      shiftPressed ? redo() : undo();
    };

    input.addEventListener('keydown', onKeyDown);
    return () => {
      input.removeEventListener('keydown', onKeyDown);
    };
  }, [inputRef, undo, redo]);

  const handlePhoneValueChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): string => {
    e.preventDefault();

    // Didn't find out how to properly type it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputType: string | undefined = (e.nativeEvent as any).inputType;
    // Possible input types:
    // https://rawgit.com/w3c/input-events/v1/index.html#interface-InputEvent-Attributes

    const getDeletionType = () => {
      const isDeletion =
        inputType?.toLocaleLowerCase().includes('delete') ?? false;
      if (!isDeletion) return undefined;

      return inputType?.toLocaleLowerCase().includes('forward')
        ? 'forward'
        : 'backward';
    };

    const isInserted = inputType?.startsWith('insertFrom');

    const value = handleValueChange(e.target.value, {
      deletion: getDeletionType(),
      inserted: isInserted,
      cursorPosition: e.target.selectionStart ?? 0,
    });

    if (disableDialCodeAndPrefix && fullCountry) {
      return addDialCode({
        phone: value,
        dialCode: fullCountry.dialCode,
        charAfterDialCode,
        prefix,
      });
    }

    return value;
  };

  const setNewCountry = (countryIso2: CountryIso2) => {
    const newCountry = getCountry({
      value: countryIso2,
      field: 'iso2',
      countries,
    });
    if (!newCountry) return;

    const newPhoneValue = disableDialCodeAndPrefix
      ? ''
      : `${prefix}${newCountry.dialCode}${charAfterDialCode}`;

    updateHistory(
      {
        phone: newPhoneValue,
        country: newCountry.iso2,
      },
      { overrideLastHistoryItem: true },
    );

    inputRef.current?.focus();
  };

  // Handle value update
  useEffect(() => {
    if (initialized && value === phone) return;
    handleValueChange(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return {
    phone, // Formatted phone string.
    country, // Current country iso code.
    setCountry: setNewCountry, // Country setter.
    handlePhoneValueChange, // Change handler for input component
    inputRef, // Ref object for input component (handles caret position, focus and undo/redo).
  };
};
