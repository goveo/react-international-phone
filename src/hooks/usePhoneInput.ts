import { useEffect, useMemo, useRef, useState } from 'react';

import { defaultCountries } from '../data/countryData';
import { CountryData, CountryIso2, ParsedCountry } from '../types';
import { getCountry, removeNonDigits } from '../utils';
import {
  handlePhoneChange,
  PhoneFormattingConfig,
} from '../utils/handlePhoneChange';
import { handleUserInput } from '../utils/handleUserInput';
import { useHistoryState } from './useHistoryState';

export const MASK_CHAR = '.';

export interface UsePhoneInputConfig {
  /**
   * @description Default country value (iso2).
   * @default "us"
   */
  defaultCountry?: CountryIso2;

  /**
   * @description phone value
   * @default ""
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
   * @ignore *forceDialCode* value will be ignored and set to *false*.
   * @default false
   */
  disableDialCodeAndPrefix?: boolean;

  /**
   * @description Callback that calls on phone change
   * @params new phone input state
   * - *data.phone* - new phone value
   * - *data.country* - new country value
   * @default undefined
   */
  onChange?: (data: {
    phone: string;
    e164Phone: string;
    country: CountryIso2;
  }) => void;
}

export const defaultConfig: Required<
  Omit<UsePhoneInputConfig, 'onChange'> // omit props with no default value
> = {
  defaultCountry: 'us',
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

export const usePhoneInput = ({
  defaultCountry = defaultConfig.defaultCountry,
  value = defaultConfig.value,
  countries = defaultConfig.countries,
  prefix = defaultConfig.prefix,
  defaultMask = defaultConfig.defaultMask,
  charAfterDialCode = defaultConfig.charAfterDialCode,
  historySaveDebounceMS = defaultConfig.historySaveDebounceMS,
  disableCountryGuess = defaultConfig.disableCountryGuess,
  disableDialCodePrefill = defaultConfig.disableDialCodePrefill,
  forceDialCode: forceDialCodeConfig = defaultConfig.forceDialCode,
  disableDialCodeAndPrefix = defaultConfig.disableDialCodeAndPrefix,
  onChange,
}: UsePhoneInputConfig) => {
  const countryGuessingEnabled = !disableCountryGuess;
  const forceDialCode = disableDialCodeAndPrefix ? false : forceDialCodeConfig;

  const phoneFormattingConfig: PhoneFormattingConfig = {
    countries,
    prefix,
    charAfterDialCode,
    forceDialCode,
    disableDialCodeAndPrefix,
    defaultMask,
    countryGuessingEnabled,
  };

  const inputRef = useRef<HTMLInputElement | null>(null);

  const setCursorPosition = (cursorPosition: number) => {
    /**
     * HACK: should set cursor on the next tick to make sure that the phone value is updated
     * useTimeout with 0ms provides issues when two keys are pressed same time
     */
    Promise.resolve().then(() => {
      inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
    });
  };

  const [{ phone, e164Phone, country }, updateHistory, undo, redo] =
    useHistoryState(
      () => {
        const defaultCountryFull = getCountry({
          value: defaultCountry,
          field: 'iso2',
          countries,
        });

        if (!defaultCountryFull) {
          // default country is not passed, or iso code do not match
          console.error(
            `[react-international-phone]: can not find a country with "${defaultCountry}" iso2 code`,
          );
        }

        const initialCountry =
          defaultCountryFull || // fallback to "us" if user provided not valid country
          (getCountry({
            value: 'us',
            field: 'iso2',
            countries,
          }) as ParsedCountry);

        const {
          phone,
          e164Phone,
          country: formatCountry,
        } = handlePhoneChange({
          value,
          country: initialCountry,
          insertDialCodeOnEmpty: !disableDialCodePrefill,
          ...phoneFormattingConfig,
        });

        setCursorPosition(phone.length);

        return {
          phone,
          e164Phone,
          country: formatCountry.iso2,
        };
      },
      {
        overrideLastItemDebounceMS: historySaveDebounceMS,
        onChange: ({ phone, e164Phone, country }) => {
          onChange?.({ phone, e164Phone, country });
        },
      },
    );

  const fullCountry = useMemo(() => {
    return getCountry({
      value: country,
      field: 'iso2',
      countries,
    }) as ParsedCountry;
  }, [countries, country]);

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

    const {
      phone: newPhone,
      e164Phone: newE164Phone,
      country: newCountry,
      cursorPosition: newCursorPosition,
    } = handleUserInput(e, {
      country: fullCountry,
      phoneBeforeInput: phone,
      insertDialCodeOnEmpty: false, // allow user to clear input

      ...phoneFormattingConfig,
    });

    updateHistory({
      phone: newPhone,
      e164Phone: newE164Phone,
      country: newCountry.iso2,
    });

    setCursorPosition(newCursorPosition);

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

    updateHistory({
      phone: newPhoneValue,
      e164Phone: `${prefix}${removeNonDigits(newPhoneValue)}`,
      country: newCountry.iso2,
    });

    // Next tick is used to support UI libraries (had an issue with MUI)
    Promise.resolve().then(() => {
      inputRef.current?.focus();
    });
  };

  const [initialized, setInitialized] = useState(false);

  // Handle value update
  useEffect(() => {
    if (!initialized) {
      setInitialized(true);

      if (value !== e164Phone) {
        // Can call onChange directly because phone value was formatted inside the useHistoryState setter
        onChange?.({
          phone,
          e164Phone,
          country,
        });
      }

      // skip value handling on initial render
      return;
    }

    if (value === e164Phone) return;

    // new value has been provided to the "value" prop (updated not via input field)

    const {
      phone: newPhone,
      e164Phone: newE164Phone,
      country: newCountry,
    } = handlePhoneChange({
      value,
      country: fullCountry,
      insertDialCodeOnEmpty: !disableDialCodePrefill,
      ...phoneFormattingConfig,
    });

    updateHistory({
      phone: newPhone,
      e164Phone: newE164Phone,
      country: newCountry.iso2,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return {
    phone, // Formatted phone string.
    e164Phone, // Phone in E164 format
    country, // Current country iso code.
    setCountry: setNewCountry, // Country setter.
    handlePhoneValueChange, // Change handler for input component
    inputRef, // Ref object for input component (handles caret position, focus and undo/redo).
  };
};
