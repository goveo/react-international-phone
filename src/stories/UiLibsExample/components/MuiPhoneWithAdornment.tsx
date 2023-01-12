import { Button, TextField } from '@mui/material';
import React from 'react';

import { CountrySelector, usePhoneInput } from '../../../index';
import { MUIPhoneProps } from './MuiPhone';

export const MuiPhoneWithAdornment: React.FC<MUIPhoneProps> = ({
  value,
  onChange,
}) => {
  const { phone, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      initialCountry: 'us',
      value,
      onCountryChange: onChange,
    });

  return (
    <TextField
      label="Phone number"
      color="primary"
      placeholder="Phone number"
      value={phone}
      onChange={(e) => {
        const value = handlePhoneValueChange(e);
        onChange(value);
      }}
      inputRef={inputRef}
      InputProps={{
        startAdornment: (
          <CountrySelector
            selectedCountry={country}
            onSelect={(country) => setCountry(country.iso2)}
            renderButtonWrapper={({ children, onClick }) => (
              <Button
                onClick={onClick}
                color="primary"
                sx={{
                  ml: '-8px',
                  mr: '4px',
                  p: '4px',
                  minWidth: 'fit-content',
                }}
              >
                {children}
              </Button>
            )}
          />
        ),
      }}
    />
  );
};
