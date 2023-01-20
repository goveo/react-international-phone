import './CountrySelector.style.scss';

import React, { useMemo, useRef, useState } from 'react';

import { defaultCountries } from '../../data/countryData';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { buildClassNames } from '../../style/buildClassNames';
import { CountryData, CountryIso2 } from '../../types';
import { getCountry } from '../../utils';
import { FlagEmoji } from '../FlagEmoji/FlagEmoji';
import {
  CountrySelectorDropdown,
  CountrySelectorDropdownProps,
  CountrySelectorDropdownStyleProps,
} from './CountrySelectorDropdown';

export interface CountrySelectorStyleProps {
  style?: React.CSSProperties;
  className?: string;

  buttonStyle?: React.CSSProperties;
  buttonClassName?: string;

  buttonContentWrapperStyle?: React.CSSProperties;
  buttonContentWrapperClassName?: string;

  flagStyle?: React.CSSProperties;
  flagClassName?: string;

  dropdownArrowStyle?: React.CSSProperties;
  dropdownArrowClassName?: string;

  dropdownStyleProps?: CountrySelectorDropdownStyleProps;
}

export interface CountrySelectorProps extends CountrySelectorStyleProps {
  selectedCountry: CountryIso2;
  onSelect?: CountrySelectorDropdownProps['onSelect'];
  disabled?: boolean;
  hideDropdown?: boolean;
  countries?: CountryData[];
  renderButtonWrapper?: (props: {
    children: React.ReactNode;
    onClick: () => void;
  }) => React.ReactNode;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onSelect,
  disabled,
  hideDropdown,
  countries = defaultCountries,
  renderButtonWrapper,
  ...styleProps
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const fullSelectedCountry = useMemo(() => {
    if (!selectedCountry) return undefined;
    return getCountry({
      value: selectedCountry,
      field: 'iso2',
      countries: countries,
    });
  }, [countries, selectedCountry]);

  const countrySelectorRef = useRef<HTMLDivElement>(null);

  useOnClickOutside({
    ref: countrySelectorRef,
    onClickOutside: () => setShowDropdown(false),
  });

  const renderSelectorButton = () => {
    const onClick = () => setShowDropdown((v) => !v);

    const buttonContent = (
      <div
        className={buildClassNames({
          addPrefix: ['country-selector-button__button-content'],
          rawClassNames: [styleProps.buttonContentWrapperClassName],
        })}
        style={styleProps.buttonContentWrapperStyle}
      >
        <FlagEmoji
          iso2={selectedCountry}
          className={buildClassNames({
            addPrefix: [
              'country-selector-button__flag-emoji',
              disabled && 'country-selector-button__flag-emoji--disabled',
            ],
            rawClassNames: [styleProps.flagClassName],
          })}
          style={{
            visibility: selectedCountry ? 'visible' : 'hidden',
            ...styleProps.flagStyle,
          }}
        />
        {!hideDropdown && (
          <div
            className={buildClassNames({
              addPrefix: [
                'country-selector-button__dropdown-arrow',
                disabled && 'country-selector-button__dropdown-arrow--disabled',
                showDropdown &&
                  'country-selector-button__dropdown-arrow--active',
              ],
              rawClassNames: [styleProps.dropdownArrowClassName],
            })}
            style={styleProps.dropdownArrowStyle}
          />
        )}
      </div>
    );
    if (renderButtonWrapper) {
      return renderButtonWrapper({ children: buttonContent, onClick });
    }
    return (
      <button
        type="button"
        title={fullSelectedCountry?.name}
        onClick={onClick}
        className={buildClassNames({
          addPrefix: [
            'country-selector-button',
            showDropdown && 'country-selector-button--active',
            disabled && 'country-selector-button--disabled',
            hideDropdown && 'country-selector-button--hide-dropdown',
          ],
          rawClassNames: [styleProps.buttonClassName],
        })}
        disabled={hideDropdown || disabled}
        role="combobox"
        aria-label="Country selector"
        aria-haspopup="listbox"
        aria-expanded={showDropdown}
        data-country={selectedCountry}
        style={styleProps.buttonStyle}
      >
        {buttonContent}
      </button>
    );
  };

  return (
    <div
      className={buildClassNames({
        addPrefix: ['country-selector'],
        rawClassNames: [styleProps.className],
      })}
      style={styleProps.style}
      ref={countrySelectorRef}
    >
      {renderSelectorButton()}
      <CountrySelectorDropdown
        show={showDropdown}
        countries={countries}
        onSelect={(country) => {
          setShowDropdown(false);
          onSelect?.(country);
        }}
        selectedCountry={selectedCountry}
        onEscapePress={() => {
          setShowDropdown(false);
        }}
        {...styleProps.dropdownStyleProps}
      />
    </div>
  );
};
