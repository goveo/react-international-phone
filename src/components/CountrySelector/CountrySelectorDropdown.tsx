import './CountrySelectorDropdown.style.scss';

import React, { useCallback, useEffect, useRef } from 'react';

import { defaultCountries } from '../../data/countryData';
import { buildClassNames } from '../../style/buildClassNames';
import { CountryData, CountryIso2, ParsedCountry } from '../../types';
import { parseCountry, scrollToChild } from '../../utils';
import { FlagEmoji } from '../FlagEmoji/FlagEmoji';

export interface CountrySelectorDropdownStyleProps {
  style?: React.CSSProperties;
  className?: string;

  listItemStyle?: React.CSSProperties;
  listItemClassName?: string;

  listItemFlagStyle?: React.CSSProperties;
  listItemFlagClassName?: string;

  listItemCountryNameStyle?: React.CSSProperties;
  listItemCountryNameClassName?: string;

  listItemDialCodeStyle?: React.CSSProperties;
  listItemDialCodeClassName?: string;
}

export interface CountrySelectorDropdownProps
  extends CountrySelectorDropdownStyleProps {
  show: boolean;
  dialCodePrefix?: string;
  selectedCountry?: CountryIso2;
  countries?: CountryData[];
  onSelect?: (country: ParsedCountry) => void;
  onEscapePress?: () => void;
}

export const CountrySelectorDropdown: React.FC<
  CountrySelectorDropdownProps
> = ({
  show,
  dialCodePrefix = '+',
  selectedCountry,
  countries = defaultCountries,
  onSelect,
  onEscapePress,
  ...styleProps
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  const lastSelectedCountry = useRef<CountryIso2>();

  const handleCountrySelect = useCallback(
    (country: ParsedCountry) => {
      lastSelectedCountry.current = country.iso2;
      onSelect?.(country);
    },
    [onSelect],
  );

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLLIElement>, country: ParsedCountry) => {
      if (e.key === 'Enter') {
        handleCountrySelect(country);
      }
      if (e.key === 'Escape') {
        onEscapePress?.();
      }
    },
    [handleCountrySelect, onEscapePress],
  );

  // Scroll to selected country
  useEffect(() => {
    if (
      !listRef.current ||
      !selectedCountry ||
      // Don't scroll if user selected country by clicking dropdown item
      selectedCountry === lastSelectedCountry.current
    )
      return;

    const element = listRef.current.querySelector(
      `[data-country="${selectedCountry}"]`,
    );
    if (!element) return;

    scrollToChild(listRef.current, element as HTMLElement);
    lastSelectedCountry.current = selectedCountry;
  }, [selectedCountry]);

  return (
    <ul
      ref={listRef}
      role="listbox"
      className={buildClassNames({
        addPrefix: ['country-selector-dropdown'],
        rawClassNames: [styleProps.className],
      })}
      style={{ display: show ? 'block' : 'none', ...styleProps.style }}
    >
      {countries.map((c) => {
        const country = parseCountry(c);
        const isSelected = country.iso2 === selectedCountry;

        return (
          <li
            key={country.iso2}
            data-country={country.iso2}
            tabIndex={0}
            role="option"
            className={buildClassNames({
              addPrefix: [
                'country-selector-dropdown__list-item',
                isSelected && 'country-selector-dropdown__list-item--selected',
              ],
              rawClassNames: [styleProps.listItemClassName],
            })}
            onClick={() => handleCountrySelect(country)}
            onKeyDown={(e) => {
              handleKeyPress(e, country);
            }}
            style={styleProps.listItemStyle}
          >
            <FlagEmoji
              iso2={country.iso2}
              className={buildClassNames({
                addPrefix: ['country-selector-dropdown__list-item-flag-emoji'],
                rawClassNames: [styleProps.listItemFlagClassName],
              })}
              style={styleProps.listItemFlagStyle}
            />
            <span
              className={buildClassNames({
                addPrefix: [
                  'country-selector-dropdown__list-item-country-name',
                ],
                rawClassNames: [styleProps.listItemCountryNameClassName],
              })}
              style={styleProps.listItemCountryNameStyle}
            >
              {country.name}
            </span>
            <span
              className={buildClassNames({
                addPrefix: ['country-selector-dropdown__list-item-dial-code'],
                rawClassNames: [styleProps.listItemDialCodeClassName],
              })}
              style={styleProps.listItemDialCodeStyle}
            >
              {dialCodePrefix}
              {country.dialCode}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
