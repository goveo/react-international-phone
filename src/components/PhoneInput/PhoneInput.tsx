import './PhoneInput.style.scss';

import React, { useMemo } from 'react';

import { defaultCountries } from '../../data/countryData';
import { usePhoneInput, UsePhoneInputConfig } from '../../hooks/usePhoneInput';
import { buildClassNames } from '../../style/buildClassNames';
import { CountryIso2 } from '../../types';
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
  extends Omit<UsePhoneInputConfig, 'onChange'>,
    PhoneInputStyleProps {
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
   * @description Custom flag URLs array
   * @default undefined
   */
  flags?: CountrySelectorProps['flags'];

  /**
   * @description Callback that calls on phone change
   * @params `phone` - new phone value, `country` - country iso2 value
   * @default undefined
   */
  onChange?: (phone: string, country: CountryIso2) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  hideDropdown,
  placeholder,
  disabled,
  showDisabledDialCodeAndPrefix,
  inputProps,
  flags,
  onChange,

  style,
  className,
  inputStyle,
  inputClassName,
  countrySelectorStyleProps,
  dialCodePreviewStyleProps,

  value,
  countries = defaultCountries,
  ...usePhoneInputConfig
}) => {
  const { phone, inputRef, country, setCountry, handlePhoneValueChange } =
    usePhoneInput({
      value,
      countries,
      ...usePhoneInputConfig,
      onChange: (data) => {
        onChange?.(data.phone, data.country);
      },
    });

  const fullCountry = useMemo(() => {
    if (!country) return;
    return getCountry({
      value: country,
      field: 'iso2',
      countries,
    });
  }, [countries, country]);

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
        flags={flags}
        selectedCountry={country}
        countries={countries}
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
        onChange={handlePhoneValueChange}
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
