import './CountrySelector.style.scss';

import React, { ReactNode, useMemo, useRef, useState } from 'react';

import { defaultCountries } from '../../data/countryData';
import { buildClassNames } from '../../style/buildClassNames';
import { CountryData, CountryIso2, ParsedCountry } from '../../types';
import { getCountry } from '../../utils';
import { FlagImage } from '../FlagImage/FlagImage';
import { AvailableKeys } from '../PhoneInput/PhoneInput';
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

type RenderButtonWrapperRootProps = {
  // Omit the event argument to prevent errors on event mistype
  onClick: () => void;
} & Pick<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  | 'onKeyDown'
  | 'onMouseDown'
  | 'title'
  | 'disabled'
  | 'role'
  | 'aria-label'
  | 'aria-haspopup'
  | 'aria-expanded'
>;

export interface CountrySelectorProps extends CountrySelectorStyleProps {
  selectedCountry: CountryIso2;
  onSelect?: CountrySelectorDropdownProps['onSelect'];
  disabled?: boolean;
  hideDropdown?: boolean;
  countries?: CountryData[];
  preferredCountries?: CountryIso2[];
  flags?: CountrySelectorDropdownProps['flags'];
  renderButtonWrapper?: (props: {
    children: React.ReactNode;
    rootProps: RenderButtonWrapperRootProps;
  }) => React.ReactNode;
  order?: AvailableKeys[];
  country?: ParsedCountry;
  customArrow?: ReactNode;
  openDropdown?: boolean;
  setIsOpenDropdown?: (value: React.SetStateAction<boolean>) => void;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onSelect,
  disabled,
  hideDropdown,
  countries = defaultCountries,
  preferredCountries = [],
  flags,
  renderButtonWrapper,

  order,
  country,
  customArrow,
  openDropdown,
  setIsOpenDropdown,

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!e.key) return;

    if (['ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();

      if (setIsOpenDropdown) setIsOpenDropdown(true);
      setShowDropdown(true);
    }
  };

  const renderSelectorButton = () => {
    const rootProps: RenderButtonWrapperRootProps = {
      title: fullSelectedCountry?.name,
      onClick: () => {
        if (setIsOpenDropdown) setIsOpenDropdown((v) => !v);
        setShowDropdown((v) => !v);
      },
      // Need this to close dropdown on selector button click
      // https://stackoverflow.com/a/28963938
      onMouseDown: (e) => e.preventDefault(),
      onKeyDown: handleKeyDown,
      disabled: hideDropdown || disabled,
      role: 'combobox',
      'aria-label': 'Country selector',
      'aria-haspopup': 'listbox',
      'aria-expanded': openDropdown ?? showDropdown,
    };

    const orderItems = {
      flag: (
        <FlagImage
          iso2={selectedCountry}
          src={flags?.find((f) => f.iso2 === selectedCountry)?.src}
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
      ),
      country: <div>{country?.name}</div>,
      dial: <div>+{country?.dialCode}</div>,
      arrow: customArrow || (
        <div
          className={buildClassNames({
            addPrefix: [
              'country-selector-button__dropdown-arrow',
              disabled && 'country-selector-button__dropdown-arrow--disabled',
              (openDropdown ?? showDropdown) &&
                'country-selector-button__dropdown-arrow--active',
            ],
            rawClassNames: [styleProps.dropdownArrowClassName],
          })}
          style={styleProps.dropdownArrowStyle}
        />
      ),
    };

    const buttonContent = (
      <div
        className={buildClassNames({
          addPrefix: ['country-selector-button__button-content'],
          rawClassNames: [styleProps.buttonContentWrapperClassName],
        })}
        style={styleProps.buttonContentWrapperStyle}
      >
        {order?.map((item, index) => (
          <div key={`item#${index}`}>{orderItems[item]}</div>
        ))}
      </div>
    );
    if (renderButtonWrapper) {
      return renderButtonWrapper({
        children: buttonContent,
        rootProps: rootProps,
      });
    }
    return (
      <button
        {...rootProps}
        type="button"
        className={buildClassNames({
          addPrefix: [
            'country-selector-button',
            (openDropdown ?? showDropdown) && 'country-selector-button--active',
            disabled && 'country-selector-button--disabled',
            hideDropdown && 'country-selector-button--hide-dropdown',
          ],
          rawClassNames: [styleProps.buttonClassName],
        })}
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
        show={openDropdown ?? showDropdown}
        countries={countries}
        preferredCountries={preferredCountries}
        flags={flags}
        onSelect={(country) => {
          if (setIsOpenDropdown) setIsOpenDropdown(false);
          setShowDropdown(false);
          onSelect?.(country);
        }}
        selectedCountry={selectedCountry}
        onClose={() => {
          if (setIsOpenDropdown) setIsOpenDropdown(false);
          setShowDropdown(false);
        }}
        {...styleProps.dropdownStyleProps}
      />
    </div>
  );
};
