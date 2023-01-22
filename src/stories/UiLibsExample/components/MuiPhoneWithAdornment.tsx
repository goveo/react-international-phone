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
            renderButtonWrapper={({ children, rootProps }) => (
              <Button
                {...rootProps}
                color="primary"
                sx={{
                  margin: '0 4px 0 -4px',
                  padding: '2px',
                  minWidth: '0',
                }}
              >
                {children}
              </Button>
            )}
            dropdownStyleProps={{
              style: {
                top: '42px',
                left: '-14px',
              },
            }}
          />
        ),
      }}
    />
  );
};
