import './PhoneInput.style.scss';

import React from 'react';

import { usePhoneInput, UsePhoneInputConfig } from '../../hooks/usePhoneInput';
import {
  CountrySelector,
  CountrySelectorProps,
} from '../CountrySelector/CountrySelector';

export interface PhoneInputProps extends UsePhoneInputConfig {
  phone?: string;
  hideDropdown?: CountrySelectorProps['hideDropdown'];
  placeholder?: React.InputHTMLAttributes<HTMLInputElement>['placeholder'];
  disabled?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  onChange?: (phone: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  phone: initialValue = '',
  hideDropdown,
  placeholder,
  disabled,
  inputProps,
  onChange,
  ...usePhoneInputConfig
}) => {
  const { phone, inputRef, country, setCountry, handlePhoneValueChange } =
    usePhoneInput(initialValue, usePhoneInputConfig);

  return (
    <div className="react-phone-input-container">
      <CountrySelector
        onSelect={(country) => setCountry(country.iso2)}
        selectedCountry={country}
        disabled={disabled}
        hideDropdown={hideDropdown}
      />

      <input
        onChange={(e) => {
          handlePhoneValueChange(e);
          onChange?.(phone);
        }}
        value={phone}
        type="tel"
        ref={inputRef}
        className={[
          'react-phone-input',
          disabled ? 'react-phone-input--disabled' : '',
        ].join(' ')}
        placeholder={placeholder}
        disabled={disabled}
        {...inputProps}
      />
    </div>
  );
};
