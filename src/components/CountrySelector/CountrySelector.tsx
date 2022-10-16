import './CountrySelector.style.scss';

import React, { useMemo, useState } from 'react';

import { CountryIso2 } from '../../types';
import { getCountry } from '../../utils';
import { FlagEmoji } from '../FlagEmoji/FlagEmoji';
import {
  CountrySelectorDropdown,
  CountrySelectorDropdownProps,
} from './CountrySelectorDropdown';

export interface CountrySelectorProps {
  selectedCountry?: CountryIso2;
  onSelect?: CountrySelectorDropdownProps['onSelect'];
  disabled?: boolean;
  hideDropdown?: boolean;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onSelect,
  disabled,
  hideDropdown,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  const fullSelectedCountry = useMemo(() => {
    if (!selectedCountry) return undefined;
    return getCountry(selectedCountry, 'iso2');
  }, [selectedCountry]);

  return (
    <>
      <button
        title={fullSelectedCountry?.name}
        onClick={() => setShowDropdown(true)}
        className={[
          'country-selector-button',
          showDropdown ? 'country-selector-button--active' : '',
          disabled ? 'country-selector-button--disabled' : '',
          hideDropdown ? 'country-selector-button--hide-dropdown' : '',
        ].join(' ')}
        disabled={hideDropdown || disabled}
        aria-haspopup="listbox"
        aria-expanded={hideDropdown}
      >
        <FlagEmoji
          iso2={selectedCountry}
          className={[
            'country-selector-button__flag-emoji',
            disabled ? 'country-selector-button__flag-emoji--disabled' : '',
          ].join(' ')}
          style={{ visibility: selectedCountry ? 'visible' : 'hidden' }}
        />
        {!hideDropdown && (
          <div
            className={[
              'country-selector-button__dropdown-arrow',
              disabled
                ? 'country-selector-button__dropdown-arrow--disabled'
                : '',
              showDropdown
                ? 'country-selector-button__dropdown-arrow--active'
                : '',
            ].join(' ')}
          />
        )}
      </button>

      <CountrySelectorDropdown
        show={showDropdown}
        onSelect={(country) => {
          setShowDropdown(false);
          onSelect?.(country);
        }}
        selectedCountry={selectedCountry}
        onClickOutside={() => {
          setShowDropdown(false);
        }}
        onEscapePress={() => {
          setShowDropdown(false);
        }}
      />
    </>
  );
};
