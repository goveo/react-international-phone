import { useRef, useState } from 'react';

import { CountryIso2 } from '../types';
import { usePhone, UsePhoneConfig } from './usePhone';

export interface UsePhoneInputConfig extends Omit<UsePhoneConfig, 'country'> {
  /**
   * @description Initial country value (iso2).
   */
  initialCountry: CountryIso2;

  /**
   * @description Initial phone value
   * @default ""
   */
  initialPhone?: string;
}

export const usePhoneInput = ({
  initialCountry,
  initialPhone = '',
  ...config
}: UsePhoneInputConfig) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [country, setCountry] = useState<CountryIso2 | undefined>(
    initialCountry,
  );

  const { phone, handlePhoneValueChange } = usePhone(initialPhone, {
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
