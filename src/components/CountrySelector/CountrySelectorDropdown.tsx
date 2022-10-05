import './CountrySelectorDropdown.style.scss';

import React, { useCallback, useRef } from 'react';

import { countries } from '../../data/countryData';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { ParsedCountry } from '../../types';
import { parseCountry } from '../../utils';
import { FlagEmoji } from '../FlagEmoji/FlagEmoji';

export interface CountrySelectorDropdownProps {
  show: boolean;
  dialCodePrefix?: string;
  selectedCountryIso2?: string;
  onSelect?: (country: ParsedCountry) => void;
  onClickOutside?: () => void;
}

export const CountrySelectorDropdown: React.FC<
  CountrySelectorDropdownProps
> = ({
  show = false,
  dialCodePrefix = '+',
  selectedCountryIso2,
  onSelect,
  onClickOutside,
}) => {
  const listRef = useRef<HTMLUListElement>(null);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLLIElement>, country: ParsedCountry) => {
      if (e.key === 'Enter') {
        onSelect?.(country);
      }
    },
    [onSelect],
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
        const isSelected = country.iso2 === selectedCountryIso2;

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
