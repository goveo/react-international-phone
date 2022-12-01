import { IconButton, TextField } from '@mui/material';
import React from 'react';

import { CountrySelector, usePhoneInput } from '../../../index';

interface MUIPhoneProps {
  value: string;
  onChange: (phone: string) => void;
}

export const MuiPhone: React.FC<MUIPhoneProps> = ({ value, onChange }) => {
  const phoneInput = usePhoneInput({
    initialCountry: 'us',
    value,
    onCountryChange: onChange,
  });

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <CountrySelector
        selectedCountry={phoneInput.country}
        onSelect={(country) => phoneInput.setCountry(country.iso2)}
        renderButtonWrapper={({ children, onClick }) => (
          <IconButton
            onClick={onClick}
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
        value={phoneInput.phone}
        onChange={(e) => {
          const value = phoneInput.handlePhoneValueChange(
            e as React.ChangeEvent<HTMLInputElement>,
          );
          onChange(value);
        }}
        inputRef={phoneInput.inputRef}
      />
    </div>
  );
};
