import './CountrySelectorDropdown.style.scss';

import React, { useCallback, useEffect, useRef, useState } from 'react';

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
  selectedCountry: CountryIso2;
  countries?: CountryData[];
  onSelect?: (country: ParsedCountry) => void;
  onClose?: () => void;
}

export const CountrySelectorDropdown: React.FC<
  CountrySelectorDropdownProps
> = ({
  show,
  dialCodePrefix = '+',
  selectedCountry,
  countries = defaultCountries,
  onSelect,
  onClose,
  ...styleProps
}) => {
  const listRef = useRef<HTMLUListElement>(null);
  const lastScrolledCountry = useRef<CountryIso2>();

  const getCountryIndex = useCallback(
    (country: CountryIso2) => {
      return countries.findIndex((c) => parseCountry(c).iso2 === country);
    },
    [countries],
  );

  const [activeItemIndex, setActiveItemIndex] = useState(
    getCountryIndex(selectedCountry),
  );

  const resetActiveItemIndex = () => {
    if (lastScrolledCountry.current === selectedCountry) return;
    setActiveItemIndex(getCountryIndex(selectedCountry));
  };

  const handleCountrySelect = useCallback(
    (country: ParsedCountry) => {
      setActiveItemIndex(getCountryIndex(country.iso2));
      onSelect?.(country);
    },
    [onSelect, getCountryIndex],
  );

  const moveActiveItem = (direction: 'up' | 'down') => {
    const indexShift = direction === 'up' ? -1 : 1;
    setActiveItemIndex((v) => {
      const newIndex = v + indexShift;
      if (newIndex < 0) return 0;
      if (newIndex > countries.length - 1) return countries.length - 1;
      return newIndex;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    if (e.key === 'Enter') {
      const activeCountry = parseCountry(countries[activeItemIndex]);
      handleCountrySelect(activeCountry);
      return;
    }

    if (e.key === 'Escape') {
      onClose?.();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveActiveItem('up');
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveActiveItem('down');
      return;
    }
  };

  const scrollToActiveCountry = useCallback(() => {
    if (!listRef.current || activeItemIndex === undefined) return;

    const activeCountry = parseCountry(countries[activeItemIndex]).iso2;
    if (activeCountry === lastScrolledCountry.current) return;

    const element = listRef.current.querySelector(
      `[data-country="${activeCountry}"]`,
    );
    if (!element) return;
    scrollToChild(listRef.current, element as HTMLElement);

    lastScrolledCountry.current = activeCountry;
  }, [activeItemIndex, countries]);

  // Scroll to active item on change
  useEffect(() => {
    scrollToActiveCountry();
  }, [activeItemIndex, scrollToActiveCountry]);

  useEffect(() => {
    if (!listRef.current) return;

    if (show) {
      // Autofocus on open dropdown
      listRef.current.focus();
    } else {
      resetActiveItemIndex();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  // Update activeItemIndex on selectedCountry prop change
  useEffect(() => {
    resetActiveItemIndex();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      onKeyDown={handleKeyDown}
      onBlur={onClose}
      tabIndex={-1}
      aria-activedescendant={`${
        parseCountry(countries[activeItemIndex]).iso2
      }-option`}
    >
      {countries.map((c, index) => {
        const country = parseCountry(c);
        const isSelected = country.iso2 === selectedCountry;
        const isActive = index === activeItemIndex;

        return (
          <li
            key={country.iso2}
            data-country={country.iso2}
            role="option"
            aria-selected={isSelected}
            aria-label={`${country.name} ${dialCodePrefix}${country.dialCode}`}
            id={`${country.iso2}-option`}
            className={buildClassNames({
              addPrefix: [
                'country-selector-dropdown__list-item',
                isSelected && 'country-selector-dropdown__list-item--selected',
                isActive && 'country-selector-dropdown__list-item--active',
              ],
              rawClassNames: [styleProps.listItemClassName],
            })}
            onClick={() => handleCountrySelect(country)}
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
