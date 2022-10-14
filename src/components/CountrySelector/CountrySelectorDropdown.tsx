import './CountrySelectorDropdown.style.scss';

import React, { useCallback, useRef } from 'react';

import { countries } from '../../data/countryData';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { CountryIso2, ParsedCountry } from '../../types';
import { parseCountry } from '../../utils';
import { FlagEmoji } from '../FlagEmoji/FlagEmoji';

export interface CountrySelectorDropdownProps {
  show: boolean;
  dialCodePrefix?: string;
  selectedCountry?: CountryIso2;
  onSelect?: (country: ParsedCountry) => void;
  onClickOutside?: () => void;
  onEscapePress?: () => void;
}

export const CountrySelectorDropdown: React.FC<
  CountrySelectorDropdownProps
> = ({
  show = false,
  dialCodePrefix = '+',
  selectedCountry,
  onSelect,
  onClickOutside,
  onEscapePress,
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
      className="country-selector-dropdown"
      style={{ visibility: show ? 'visible' : 'hidden' }}
    >
      {countries.map((c) => {
        const country = parseCountry(c);
        const isSelected = country.iso2 === selectedCountry;

        return (
          <li
            key={country.iso2}
            tabIndex={0}
            role="option"
            className={[
              'country-selector-dropdown__list-item',
              isSelected
                ? 'country-selector-dropdown__list-item--selected'
                : '',
            ].join(' ')}
            onClick={() => onSelect?.(country)}
            onKeyDown={(e) => {
              handleKeyPress(e, country);
            }}
          >
            <FlagEmoji
              iso2={country.iso2}
              className="country-selector-dropdown__list-item-flag-emoji"
            />
            <span className="country-selector-dropdown__list-item-country-name">
              {country.name}
            </span>
            <span className="country-selector-dropdown__list-item-dial-code">
              {dialCodePrefix}
              {country.dialCode}
            </span>
          </li>
        );
      })}
    </ul>
  );
};
