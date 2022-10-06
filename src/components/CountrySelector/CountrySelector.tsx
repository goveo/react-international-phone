import './CountrySelector.style.scss';

import React, { useMemo, useState } from 'react';

import { CountryIso2 } from '../../types';
import { getCountry } from '../../utils';
import { FlagEmoji } from '../FlagEmoji/FlagEmoji';
import {
  CountrySelectorDropdown,
  CountrySelectorDropdownProps,
} from './CountrySelectorDropdown';

interface CountrySelectorProps {
  selectedCountry?: CountryIso2;
  onSelect?: CountrySelectorDropdownProps['onSelect'];
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountry,
  onSelect,
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
        className={['country-selector-button'].join(' ')}
      >
        {selectedCountry && (
          <FlagEmoji
            iso2={selectedCountry}
            className="country-selector-button__flag-emoji"
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
      />
    </>
  );
};
