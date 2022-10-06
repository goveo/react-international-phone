import './PhoneInput.style.scss';

import React, { useMemo, useRef, useState } from 'react';

import { usePhone, UsePhoneConfig } from '../../hooks/usePhone';
import { CountryName } from '../../types';
import { getCountry } from '../../utils';
import { CountrySelector } from '../CountrySelector/CountrySelector';

interface PhoneInputProps extends UsePhoneConfig {
  onChange?: (phone: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [selectedCountry, setSelectedCountry] = useState<
    CountryName | undefined
  >();

  const fullCountry = useMemo(() => {
    if (!selectedCountry) return undefined;
    return getCountry(selectedCountry, 'name');
  }, [selectedCountry]);

  const { phone, handlePhoneValueChange } = usePhone('', {
    inputRef,
    country: selectedCountry,
    onCountryGuess: ({ country, isFullMatch }) => {
      if (isFullMatch) {
        setSelectedCountry(country.name);
      }
    },
  });

  return (
    <div className="phone-input-container">
      <CountrySelector
        onSelect={(country) => setSelectedCountry(country.name)}
        selectedCountryIso2={fullCountry?.iso2}
      />

      <input
        onChange={handlePhoneValueChange}
        value={phone}
        type="tel"
        ref={inputRef}
        className="phone-input"
      />
    </div>
  );
};
