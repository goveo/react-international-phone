import { IconButton, TextField } from '@mui/material';
import React from 'react';

import { CountrySelector, usePhoneInput } from '../../../index';

export interface MUIPhoneProps {
  value: string;
  onChange: (phone: string) => void;
}

export const MuiPhone: React.FC<MUIPhoneProps> = ({ value, onChange }) => {
  const { phone, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      initialCountry: 'us',
      value,
      onCountryChange: onChange,
    });

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <CountrySelector
        selectedCountry={country}
        onSelect={(country) => setCountry(country.iso2)}
        renderButtonWrapper={({ children, rootProps }) => (
          <IconButton
            {...rootProps}
            color="primary"
            sx={{ mr: '4px', height: '48px', width: '48px' }}
          >
            {children}
          </IconButton>
        )}
      />
      <TextField
        label="Phone number"
        color="primary"
        value={phone}
        onChange={(e) => {
          const value = handlePhoneValueChange(e);
          onChange(value);
        }}
        inputRef={inputRef}
      />
    </div>
  );
};
