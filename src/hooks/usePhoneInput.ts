import { useEffect, useMemo, useRef, useState } from 'react';

import { defaultCountries } from '../data/countryData';
import { CountryIso2 } from '../types';
import {
  addDialCode,
  getCountry,
  getCursorPosition,
  removeDialCode,
  removeNonDigits,
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
  const inputRef = useRef<HTMLInputElement>(null);

  const [country, setCountry] = useState<CountryIso2>(initialCountry);

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
        const cursorPosition = getCursorPosition({
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
        });

        /**
         * HACK: should set cursor on the next tick to make sure that the phone value is updated
         * useTimeout with 0ms provides issues when two keys are pressed same time
         */
        Promise.resolve().then(() => {
          inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
        });
      },
      ...restConfig,
    },
  );

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): string => {
    e.preventDefault();

    // Didn't find out how to properly type it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputType: string | undefined = (e.nativeEvent as any).inputType;

    const getDeletionType = () => {
      const isDeletion =
        inputType?.toLocaleLowerCase().includes('delete') ?? false;
      if (!isDeletion) return undefined;

      return inputType?.toLocaleLowerCase().includes('forward')
        ? 'forward'
        : 'backward';
    };

    const value = handleValueChange(e.target.value, {
      deletion: getDeletionType(),
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

  // Handle country change
  useEffect(() => {
    if (!passedCountry || !initialized) return;

    if (removeNonDigits(phone).startsWith(passedCountry.dialCode)) {
      // country was changed using input field
      return;
    }

    const newValue = handleValueChange('', { insertDialCodeOnEmpty: true });
    inputRef.current?.focus();

    onCountryChange?.(newValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  return {
    phone, // Formatted phone string.
    handlePhoneValueChange, // Change handler for input component
    inputRef, // Ref object for input component (handles caret position, focus and undo/redo).
    country, // Current country iso code.
    setCountry, // Country setter.
  };
};
