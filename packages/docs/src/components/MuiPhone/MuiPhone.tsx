/**
 * ! MuiPhone component (without color mode) is a copypaste of component -> src\stories\UiLibsExample\components\MuiPhone
 * Make sure that the original component is updated if wanna make changes here
 */

import 'react-international-phone/style.css';

import { useColorMode } from '@docusaurus/theme-common';
import {
  createTheme,
  IconButton,
  TextField,
  ThemeProvider,
} from '@mui/material';
import React from 'react';
import { CountrySelector, usePhoneInput } from 'react-international-phone';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const lightTheme = createTheme({
  palette: {
    mode: 'light',
  },
});

interface MUIPhoneProps {
  value: string;
  onChange: (phone: string) => void;
}

export const MuiPhone: React.FC<MUIPhoneProps> = ({ value, onChange }) => {
  const { colorMode } = useColorMode();

  const { phone, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      initialCountry: 'us',
      value,
      onCountryChange: onChange,
    });

  return (
    <ThemeProvider theme={colorMode === 'dark' ? darkTheme : lightTheme}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <CountrySelector
          selectedCountry={country}
          onSelect={(country) => setCountry(country.iso2)}
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
          value={phone}
          onChange={(e) => {
            const value = handlePhoneValueChange(e);
            onChange(value);
          }}
          inputRef={inputRef}
        />
      </div>
    </ThemeProvider>
  );
};
