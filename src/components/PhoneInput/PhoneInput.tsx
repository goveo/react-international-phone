import './PhoneInput.style.scss';

import React, { useMemo } from 'react';

import { usePhoneInput, UsePhoneInputConfig } from '../../hooks/usePhoneInput';
import { buildClassNames } from '../../style/buildClassNames';
import { getCountry } from '../../utils';
import {
  CountrySelector,
  CountrySelectorProps,
} from '../CountrySelector/CountrySelector';
import { DialCodePreview } from '../DialCodePreview/DialCodePreview';

export interface PhoneInputProps extends UsePhoneInputConfig {
  phone?: string;
  hideDropdown?: CountrySelectorProps['hideDropdown'];
  placeholder?: React.InputHTMLAttributes<HTMLInputElement>['placeholder'];
  disabled?: boolean;
  showDisabledDialCodeAndPrefix?: boolean;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  onChange?: (phone: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  phone: initialValue = '',
  hideDropdown,
  placeholder,
  disabled,
  showDisabledDialCodeAndPrefix,
  inputProps,
  onChange,
  ...usePhoneInputConfig
}) => {
  const { phone, inputRef, country, setCountry, handlePhoneValueChange } =
    usePhoneInput(initialValue, usePhoneInputConfig);

  const fullCountry = useMemo(() => {
    if (!country) return;
    return getCountry(country, 'iso2');
  }, [country]);

  const showDialCodePreview =
    usePhoneInputConfig.disableDialCodeAndPrefix &&
    showDisabledDialCodeAndPrefix &&
    fullCountry?.dialCode;

  return (
    <div className={buildClassNames('input-container')}>
      <CountrySelector
        onSelect={(country) => setCountry(country.iso2)}
        selectedCountry={country}
        disabled={disabled}
        hideDropdown={hideDropdown}
      />

      {showDialCodePreview && (
        <DialCodePreview
          dialCode={fullCountry.dialCode}
          prefix={usePhoneInputConfig.prefix ?? '+'}
          disabled={disabled}
        />
      )}

      <input
        onChange={(e) => {
          const newPhone = handlePhoneValueChange(e);
          onChange?.(newPhone);
        }}
        value={phone}
        type="tel"
        ref={inputRef}
        className={buildClassNames('input', disabled && 'input--disabled')}
        placeholder={placeholder}
        disabled={disabled}
        {...inputProps}
      />
    </div>
  );
};
