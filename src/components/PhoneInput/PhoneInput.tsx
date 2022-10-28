import './PhoneInput.style.scss';

import React, { useMemo } from 'react';

import { usePhoneInput, UsePhoneInputConfig } from '../../hooks/usePhoneInput';
import { buildClassNames } from '../../style/buildClassNames';
import { getCountry } from '../../utils';
import {
  CountrySelector,
  CountrySelectorProps,
  CountrySelectorStyleProps,
} from '../CountrySelector/CountrySelector';
import {
  DialCodePreview,
  DialCodePreviewStyleProps,
} from '../DialCodePreview/DialCodePreview';

export interface PhoneInputStyleProps {
  style?: React.CSSProperties;
  className?: string;

  inputStyle?: React.CSSProperties;
  inputClassName?: string;

  countrySelectorStyleProps?: CountrySelectorStyleProps;
  dialCodePreviewStyleProps?: DialCodePreviewStyleProps;
}

export interface PhoneInputProps
  extends PhoneInputStyleProps,
    UsePhoneInputConfig {
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
  hideDropdown,
  placeholder,
  disabled,
  showDisabledDialCodeAndPrefix,
  inputProps,
  onChange,

  style,
  className,
  inputStyle,
  inputClassName,
  countrySelectorStyleProps,
  dialCodePreviewStyleProps,

  ...usePhoneInputConfig
}) => {
  const { phone, inputRef, country, setCountry, handlePhoneValueChange } =
    usePhoneInput({ ...usePhoneInputConfig });

  const fullCountry = useMemo(() => {
    if (!country) return;
    return getCountry(country, 'iso2');
  }, [country]);

  const showDialCodePreview =
    usePhoneInputConfig.disableDialCodeAndPrefix &&
    showDisabledDialCodeAndPrefix &&
    fullCountry?.dialCode;

  return (
    <div
      className={buildClassNames({
        addPrefix: ['input-container'],
        rawClassNames: [className],
      })}
      style={style}
    >
      <CountrySelector
        onSelect={(country) => setCountry(country.iso2)}
        selectedCountry={country}
        disabled={disabled}
        hideDropdown={hideDropdown}
        {...countrySelectorStyleProps}
      />

      {showDialCodePreview && (
        <DialCodePreview
          dialCode={fullCountry.dialCode}
          prefix={usePhoneInputConfig.prefix ?? '+'}
          disabled={disabled}
          {...dialCodePreviewStyleProps}
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
        className={buildClassNames({
          addPrefix: ['input', disabled && 'input--disabled'],
          rawClassNames: [inputClassName],
        })}
        placeholder={placeholder}
        disabled={disabled}
        style={inputStyle}
        {...inputProps}
      />
    </div>
  );
};
