import './CountrySelectorDropdown.style.scss';

import React, { useCallback, useEffect, useRef, useState } from 'react';

import { defaultCountries } from '../../data/countryData';
import { buildClassNames } from '../../style/buildClassNames';
import { CountryData, CountryIso2, ParsedCountry } from '../../types';
import { parseCountry, scrollToChild } from '../../utils';
import { FlagEmoji } from '../FlagEmoji/FlagEmoji';

const SEARCH_DEBOUNCE_MS = 1000;

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

  const searchRef = useRef<{
    updatedAt: Date | undefined;
    value: string;
  }>({ updatedAt: undefined, value: '' });

  const updateSearch = (newChar: string) => {
    const isSearchDelayPassed =
      searchRef.current.updatedAt &&
      new Date().getTime() - searchRef.current.updatedAt.getTime() >
        SEARCH_DEBOUNCE_MS;

    searchRef.current = {
      value: isSearchDelayPassed
        ? newChar
        : `${searchRef.current.value}${newChar}`,
      updatedAt: new Date(),
    };

    const searchedCountryIndex = countries.findIndex((c) =>
      parseCountry(c).name.toLowerCase().startsWith(searchRef.current.value),
    );

    // focus to searched country
    if (searchedCountryIndex !== -1) {
      setFocusedItemIndex(searchedCountryIndex);
    }
  };

  const getCountryIndex = useCallback(
    (country: CountryIso2) => {
      return countries.findIndex((c) => parseCountry(c).iso2 === country);
    },
    [countries],
  );

  const [focusedItemIndex, setFocusedItemIndex] = useState(
    getCountryIndex(selectedCountry),
  );

  const resetFocusedItemIndex = () => {
    if (lastScrolledCountry.current === selectedCountry) return;
    setFocusedItemIndex(getCountryIndex(selectedCountry));
  };

  const handleCountrySelect = useCallback(
    (country: ParsedCountry) => {
      setFocusedItemIndex(getCountryIndex(country.iso2));
      onSelect?.(country);
    },
    [onSelect, getCountryIndex],
  );

  const moveFocusedItem = (to: 'prev' | 'next' | 'first' | 'last') => {
    const lastPossibleIndex = countries.length - 1;

    const getNewIndex = (currentIndex: number) => {
      if (to === 'prev') return currentIndex - 1;
      if (to === 'next') return currentIndex + 1;
      if (to === 'last') return lastPossibleIndex;
      return 0;
    };

    setFocusedItemIndex((v) => {
      const newIndex = getNewIndex(v);
      if (newIndex < 0) return 0;
      if (newIndex > lastPossibleIndex) return lastPossibleIndex;
      return newIndex;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLUListElement>) => {
    e.stopPropagation();

    if (e.key === 'Enter') {
      const focusedCountry = parseCountry(countries[focusedItemIndex]);
      handleCountrySelect(focusedCountry);
      return;
    }

    if (e.key === 'Escape') {
      onClose?.();
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      moveFocusedItem('prev');
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      moveFocusedItem('next');
      return;
    }

    if (e.key === 'PageUp') {
      e.preventDefault();
      moveFocusedItem('first');
      return;
    }

    if (e.key === 'PageDown') {
      e.preventDefault();
      moveFocusedItem('last');
      return;
    }

    if (e.key === ' ') {
      // prevent scrolling with space
      e.preventDefault();
    }

    if (e.key.length === 1 && !e.altKey && !e.ctrlKey && !e.metaKey) {
      updateSearch(e.key.toLocaleLowerCase());
    }
  };

  const scrollToFocusedCountry = useCallback(() => {
    if (!listRef.current || focusedItemIndex === undefined) return;

    const focusedCountry = parseCountry(countries[focusedItemIndex]).iso2;
    if (focusedCountry === lastScrolledCountry.current) return;

    const element = listRef.current.querySelector(
      `[data-country="${focusedCountry}"]`,
    );
    if (!element) return;
    scrollToChild(listRef.current, element as HTMLElement);

    lastScrolledCountry.current = focusedCountry;
  }, [focusedItemIndex, countries]);

  // Scroll to focused item on change
  useEffect(() => {
    scrollToFocusedCountry();
  }, [focusedItemIndex, scrollToFocusedCountry]);

  useEffect(() => {
    if (!listRef.current) return;

    if (show) {
      // Autofocus on open dropdown
      listRef.current.focus();
    } else {
      resetFocusedItemIndex();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  // Update focusedItemIndex on selectedCountry prop change
  useEffect(() => {
    resetFocusedItemIndex();
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
        parseCountry(countries[focusedItemIndex]).iso2
      }-option`}
    >
      {countries.map((c, index) => {
        const country = parseCountry(c);
        const isSelected = country.iso2 === selectedCountry;
        const isFocused = index === focusedItemIndex;

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
                isFocused && 'country-selector-dropdown__list-item--focused',
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
