import { useColorMode } from '@docusaurus/theme-common';
import { createTheme, ThemeProvider } from '@mui/material';
import React from 'react';

import { MuiPhone, MUIPhoneProps } from './MuiPhone';

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

export const MuiPhoneWithThemeSupport: React.FC<MUIPhoneProps> = (props) => {
  const { colorMode } = useColorMode();

  return (
    <ThemeProvider theme={colorMode === 'dark' ? darkTheme : lightTheme}>
      <MuiPhone {...props} />
    </ThemeProvider>
  );
};
