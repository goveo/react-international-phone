import './PhoneInput.style.scss';

import React, { forwardRef, useImperativeHandle, useMemo } from 'react';

import { defaultCountries } from '../../data/countryData';
import { usePhoneInput, UsePhoneInputConfig } from '../../hooks/usePhoneInput';
import { buildClassNames } from '../../style/buildClassNames';
import { CountryIso2, ParsedCountry } from '../../types';
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

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export interface PhoneInputProps
  extends Omit<UsePhoneInputConfig, 'onChange'>,
    PhoneInputStyleProps {
  /**
   * @description Hide the dropdown icon. Make country selection not accessible.
   * @default false
   */
  hideDropdown?: CountrySelectorProps['hideDropdown'];

  /**
   * @description
   * Show prefix and dial code between country selector and phone input.
   * Works only when *disableDialCodeAndPrefix* is *true*
   * @default false
   */
  showDisabledDialCodeAndPrefix?: boolean;

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
  onChange?: (
    e164Phone: string,
    meta: {
      country: ParsedCountry | undefined;
      displayValue: string;
    },
  ) => void;

  /**
   * @description Default input component props
   * @default undefined
   */
  inputProps?: InputProps;

  // pass most used input props as top level props for easy integration
  onFocus?: InputProps['onFocus'];
  onBlur?: InputProps['onBlur'];
  name?: InputProps['name'];
  required?: InputProps['required'];
  autoFocus?: InputProps['autoFocus'];
  disabled?: InputProps['disabled'];
  placeholder?: InputProps['placeholder'];
}

export type PhoneInputRefType =
  | null
  | (HTMLInputElement & {
      setCountry: (iso2: CountryIso2) => void;
    });

export const PhoneInput = forwardRef<PhoneInputRefType, PhoneInputProps>(
  (
    {
      value,
      onChange,
      countries = defaultCountries,
      hideDropdown,
      showDisabledDialCodeAndPrefix,
      flags,

      style,
      className,
      inputStyle,
      inputClassName,
      countrySelectorStyleProps,
      dialCodePreviewStyleProps,

      inputProps,
      placeholder,
      disabled,
      name,
      onFocus,
      onBlur,
      required,
      autoFocus,

      ...usePhoneInputConfig
    },
    ref,
  ) => {
    const { phone, inputRef, country, setCountry, handlePhoneValueChange } =
      usePhoneInput({
        value,
        countries,
        ...usePhoneInputConfig,
        onChange: (data) => {
          onChange?.(data.e164Phone, {
            country: getCountry({ field: 'iso2', value: data.country }),
            displayValue: data.phone,
          });
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

    useImperativeHandle<PhoneInputRefType, PhoneInputRefType>(
      ref,
      () => {
        if (!inputRef.current) return null;

        return Object.assign(inputRef.current, {
          // extend input ref with additional properties
          setCountry,
        });
      },
      [inputRef, setCountry],
    );

    return (
      <div
        ref={ref}
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
          name={name}
          onFocus={onFocus}
          onBlur={onBlur}
          autoFocus={autoFocus}
          required={required}
          {...inputProps}
        />
      </div>
    );
  },
);
