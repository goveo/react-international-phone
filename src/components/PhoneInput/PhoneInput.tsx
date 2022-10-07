import './PhoneInput.style.scss';

import React from 'react';

import { usePhoneInput, UsePhoneInputConfig } from '../../hooks/usePhoneInput';
import { CountrySelector } from '../CountrySelector/CountrySelector';

interface PhoneInputProps extends UsePhoneInputConfig {
  phone?: string;
  disableDropdown?: boolean;
  placeholder?: React.InputHTMLAttributes<HTMLInputElement>['placeholder'];
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  onChange?: (phone: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  phone: initialValue = '',
  disableDropdown,
  placeholder,
  inputProps,
  onChange,
  ...usePhoneInputConfig
}) => {
  const { phone, inputRef, country, setCountry, handlePhoneValueChange } =
    usePhoneInput(initialValue, usePhoneInputConfig);

  return (
    <div className="phone-input-container">
      <CountrySelector
        onSelect={(country) => setCountry(country.iso2)}
        selectedCountry={country}
        disableDropdown={disableDropdown}
      />

      <input
        onChange={(e) => {
          handlePhoneValueChange(e);
          onChange?.(phone);
        }}
        value={phone}
        type="tel"
        ref={inputRef}
        className="phone-input"
        placeholder={placeholder}
        {...inputProps}
      />
    </div>
  );
};