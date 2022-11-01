import { useRef, useState } from 'react';

import { countries } from '../data/countryData';
import { CountryIso2 } from '../types';
import { usePhone, UsePhoneConfig } from './usePhone';

export interface UsePhoneInputConfig
  extends Omit<UsePhoneConfig, 'country' | 'inputRef' | 'onCountryGuess'> {
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
  availableCountries = countries,
  ...config
}: UsePhoneInputConfig) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [country, setCountry] = useState<CountryIso2 | undefined>(
    initialCountry,
  );

  const { phone, handlePhoneValueChange } = usePhone(initialPhone, {
    inputRef,
    country,
    availableCountries,
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
