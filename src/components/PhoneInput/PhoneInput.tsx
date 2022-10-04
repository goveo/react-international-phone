import React, { useMemo, useRef, useState } from 'react';
import { countries } from '../../data/countryData';

import { usePhone, UsePhoneConfig } from '../../hooks/usePhone';
import { CountryName } from '../../types';
import { getCountry, parseCountry } from '../../utils';
import { FlagEmoji } from '../FlagEmoji/FlagEmoji';

import './PhoneInput.style.css';

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
  });

  return (
    <div className="phone-input">
      <FlagEmoji
        iso2={fullCountry?.iso2 || ''}
        className="phone-input__flag-emoji"
      />
      <select
        className="phone-input__country-selector"
        onChange={(e) => setSelectedCountry(e.target.value as CountryName)}
      >
        {countries.map((county) => {
          const { name: countryName } = parseCountry(county);
          return <option key={countryName}>{countryName}</option>;
        })}
      </select>
      <input
        onChange={handlePhoneValueChange}
        value={phone}
        type="tel"
        ref={inputRef}
      />
    </div>
  );
};
