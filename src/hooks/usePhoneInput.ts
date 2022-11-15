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
}

export const usePhoneInput = ({
  initialCountry,
  value = '',
  countries = defaultCountries,
  ...config
}: UsePhoneInputConfig) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [country, setCountry] = useState<CountryIso2 | undefined>(
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

  const localValue = config.disableDialCodeAndPrefix
    ? removeDialCode({
        phone: value,
        dialCode: passedCountry?.dialCode || '',
        charAfterDialCode: config.hideSpaceAfterDialCode ? '' : ' ',
        prefix: config.prefix,
      })
    : value;

  const { phone, initialized, undo, redo, handleValueChange } = usePhone(
    localValue,
    {
      country,
      countries,
      onCountryGuess: ({ country, isFullMatch }) => {
        if (isFullMatch) {
          setCountry(country.iso2);
        }
      },
      onPhoneUpdate: (
        newPhone,
        {
          formatCountry,
          unformattedValue,
          cursorPosition: cursorPositionAfterInput,
        },
      ) => {
        const cursorPosition = getCursorPosition({
          cursorPositionAfterInput,
          phoneBeforeInput: phone ?? '',
          phoneAfterInput: unformattedValue,
          phoneAfterFormatted: newPhone,
          leftOffset: config.forceDialCode
            ? (config.prefix?.length ?? 0) +
              (formatCountry?.dialCode?.length ?? 0)
            : 0,
        });

        /**
         * HACK: should set cursor on the next tick to make sure that the phone value is updated
         * useTimeout with 0ms provides issues when two keys are pressed same time
         */
        Promise.resolve().then(() => {
          inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
        });
      },
      ...config,
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
    e: React.ChangeEvent<HTMLInputElement>,
  ): string => {
    e.preventDefault();

    // Didn't find out how to properly type it
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const inputType: string | undefined = (e.nativeEvent as any).inputType;
    const isDeletion =
      inputType?.toLocaleLowerCase().includes('delete') ?? false;

    const value = handleValueChange(e.target.value, {
      isDeletion,
      cursorPosition: e.target.selectionStart ?? 0,
    });

    if (config.disableDialCodeAndPrefix) {
      return addDialCode({
        phone: value,
        dialCode: passedCountry?.dialCode || '',
        charAfterDialCode: config.hideSpaceAfterDialCode ? '' : ' ',
        prefix: config.prefix,
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

    handleValueChange('', { insertDialCodeOnEmpty: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [country]);

  return {
    inputRef,
    phone,
    handlePhoneValueChange,
    country,
    setCountry,
  };
};
