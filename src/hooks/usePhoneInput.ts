import { useRef, useState } from 'react';

import { CountryIso2 } from '../types';
import { usePhone, UsePhoneConfig } from './usePhone';

export type UsePhoneInputConfig = UsePhoneConfig;

export const usePhoneInput = (
  initialValue = '',
  config?: UsePhoneInputConfig,
) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [country, setCountry] = useState<CountryIso2 | undefined>(
    config?.country,
  );

  const { phone, handlePhoneValueChange } = usePhone(initialValue, {
    inputRef,
    country,
    onCountryGuess: ({ country, isFullMatch }) => {
      if (isFullMatch) {
        setCountry(country.iso2);
      }
    },
    ...config,
  });

  return {
    inputRef,
    phone,
    handlePhoneValueChange,
    country,
    setCountry,
  };
};
