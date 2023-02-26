import { useEffect, useMemo, useRef, useState } from 'react';

import { defaultCountries } from '../data/countryData';
import { CountryIso2 } from '../types';
import {
  addDialCode,
  getCountry,
  getCursorPosition,
  guessCountryByPartialNumber,
  removeDialCode,
} from '../utils';
import { usePhone, UsePhoneConfig } from './usePhone';

export interface UsePhoneInputConfig
  extends Omit<
    UsePhoneConfig,
    'country' | 'inputRef' | 'onCountryGuess' | 'onPhoneFormat'
  > {
  /**
   * @description Initial country value (iso2).
   */
  initialCountry: CountryIso2;

  /**
   * @description phone value
   */
  value?: string;

  /**
   * @description Hide space after country dial code
   * @default false
   */
  hideSpaceAfterDialCode?: boolean;

  /**
   * @description Callback that calls on country change
   * @params *phone* - new phone value
   * @default undefined
   */
  onCountryChange?: (phone: string) => void;
}

export const usePhoneInput = ({
  initialCountry,
  value = '',
  prefix = '+',
  countries = defaultCountries,
  disableDialCodeAndPrefix,
  hideSpaceAfterDialCode,
  onCountryChange,
  ...restConfig
}: UsePhoneInputConfig) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  // store info in ref to pass it to onPhoneUpdate callback
  const onPhoneUpdateRef = useRef<{
    shouldFocus: boolean;
    shouldSetCursorToEnd: boolean;
  }>({
    shouldFocus: false,
    shouldSetCursorToEnd: false,
  });

  const [country, setCountry] = useState<CountryIso2>(
    guessCountryByPartialNumber({ phone: value, countries }).country?.iso2 ??
      initialCountry,
  );

  const passedCountry = useMemo(() => {
    if (!country) return;
    return getCountry({
      value: country,
      field: 'iso2',
      countries,
    });
  }, [countries, country]);

  const charAfterDialCode = hideSpaceAfterDialCode ? '' : ' ';
  const dialCode = passedCountry?.dialCode ?? '';

  const localValue = disableDialCodeAndPrefix
    ? removeDialCode({
        phone: value,
        dialCode,
        charAfterDialCode,
        prefix,
      })
    : value;

  const { phone, initialized, undo, redo, handleValueChange } = usePhone(
    localValue,
    {
      country,
      countries,
      prefix,
      disableDialCodeAndPrefix,
      charAfterDialCode,
      onCountryGuess: ({ country, fullDialCodeMatch }) => {
        if (fullDialCodeMatch) {
          setCountry(country.iso2);
        }
      },
      onPhoneUpdate: (
        newPhone,
        {
          formatCountry,
          unformattedValue,
          cursorPosition: cursorPositionAfterInput,
          deletion,
        },
      ) => {
        const shouldGetCursorPosition =
          initialized && !onPhoneUpdateRef.current.shouldSetCursorToEnd;

        const cursorPosition = shouldGetCursorPosition
          ? getCursorPosition({
              cursorPositionAfterInput,
              phoneBeforeInput: phone,
              phoneAfterInput: unformattedValue,
              phoneAfterFormatted: newPhone,
              leftOffset: restConfig.forceDialCode
                ? prefix.length +
                  (formatCountry?.dialCode?.length ?? 0) +
                  charAfterDialCode.length
                : 0,
              deletion,
            })
          : newPhone.length;

        /**
         * HACK: should set cursor on the next tick to make sure that the phone value is updated
         * useTimeout with 0ms provides issues when two keys are pressed same time
         */
        Promise.resolve().then(() => {
          inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);

          if (onPhoneUpdateRef.current.shouldFocus) {
            inputRef.current?.focus();
          }

          onPhoneUpdateRef.current = {
            shouldFocus: false,
            shouldSetCursorToEnd: false,
          };
        });
      },
      ...restConfig,
    },
  );

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
      return shiftPressed ? redo() : undo();
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

    if (disableDialCodeAndPrefix) {
      return addDialCode({
        phone: value,
        dialCode,
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

    // need to call focus inside a onPhoneUpdate callback
    // because we need to wait phone-input's rerender to set focus properly
    onPhoneUpdateRef.current = {
      shouldFocus: true,
      shouldSetCursorToEnd: true,
    };

    const newValue = handleValueChange(newCountry.dialCode);
    setCountry(newCountry.iso2);

    onCountryChange?.(newValue);
  };

  return {
    phone, // Formatted phone string.
    handlePhoneValueChange, // Change handler for input component
    inputRef, // Ref object for input component (handles caret position, focus and undo/redo).
    country, // Current country iso code.
    setCountry: setNewCountry, // Country setter.
  };
};
