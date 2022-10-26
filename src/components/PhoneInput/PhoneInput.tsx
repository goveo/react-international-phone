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
  /**
   * @description Initial phone value.
   * @default ""
   */
  phone?: string;

  /**
   * @description Hide the dropdown icon. Make country selection not accessible.
   * @default false
   */
  hideDropdown?: CountrySelectorProps['hideDropdown'];

  /**
   * @description Input's placeholder
   * @default undefined
   */
  placeholder?: React.InputHTMLAttributes<HTMLInputElement>['placeholder'];

  /**
   * @description Disable phone input and country selector.
   * @default false
   */
  disabled?: boolean;

  /**
   * @description
   * Show prefix and dial code between country selector and phone input.
   * Works only when *disableDialCodeAndPrefix* is *true*
   * @default false
   */
  showDisabledDialCodeAndPrefix?: boolean;

  /**
   * @description Default input component props
   * @default undefined
   */
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;

  /**
   * @description Callback that calls on phone change
   * @params *phone* - new phone value
   * @default undefined
   */
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
    usePhoneInput({ initialPhone: initialValue, ...usePhoneInputConfig });

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
