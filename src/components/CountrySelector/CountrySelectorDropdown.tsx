import './CountrySelectorDropdown.style.scss';

import React, { useCallback, useRef } from 'react';

import { countries as fullCountyList } from '../../data/countryData';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { buildClassNames } from '../../style/buildClassNames';
import { CountryData, CountryIso2, ParsedCountry } from '../../types';
import { parseCountry } from '../../utils';
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
  onClickOutside?: () => void;
  onEscapePress?: () => void;
}

export const CountrySelectorDropdown: React.FC<
  CountrySelectorDropdownProps
> = ({
  show,
  dialCodePrefix = '+',
  selectedCountry,
  countries = fullCountyList,
  onSelect,
  onClickOutside,
  onEscapePress,
  ...styleProps
}) => {
  const listRef = useRef<HTMLUListElement>(null);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLLIElement>, country: ParsedCountry) => {
      if (e.key === 'Enter') {
        onSelect?.(country);
      }
      if (e.key === 'Escape') {
        onEscapePress?.();
      }
    },
    [onEscapePress, onSelect],
  );

  const handleClickOutside = useCallback(() => {
    onClickOutside?.();
  }, [onClickOutside]);

  useOnClickOutside({ ref: listRef, onClickOutside: handleClickOutside });

  return (
    <ul
      ref={listRef}
      role="listbox"
      className={buildClassNames({
        addPrefix: ['country-selector-dropdown'],
        rawClassNames: [styleProps.className],
      })}
      style={{ visibility: show ? 'visible' : 'hidden', ...styleProps.style }}
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
            onClick={() => onSelect?.(country)}
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
