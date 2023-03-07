import { IconButton, TextField } from '@mui/material';
import React from 'react';

import { CountrySelector, usePhoneInput } from '../../../index';
import { MUIPhoneProps } from './MuiPhone';

export const MuiPhone2: React.FC<MUIPhoneProps> = ({ value, onChange }) => {
  const { phone, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: 'us',
      value,
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
