# Using with UI libraries

You can build phone input by combination of **input component** (that you want to be a phone input), [**usePhoneInput**](./usePhoneInput) hook and [**CountrySelector**](../Subcomponents%20API/CountrySelector)

## Material UI Example

import { MuiPhone } from '@site/src/components/MuiPhone/MuiPhone'

<div style={{ margin: "3rem 0 2rem" }}>
<MuiPhone />
</div>

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>

<TabItem value="jsx" label="JavaScript">

```jsx
import { Button, TextField } from '@mui/material';
import React from 'react';
import { CountrySelector, usePhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export const MuiPhoneInput = ({ value, onChange }) => {
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
                  margin: '0 4px 0 -4px',
                  padding: '2px',
                  minWidth: '0',
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
```

  </TabItem>

  <TabItem value="tsx" label="TypeScript">

```tsx
import { Button, TextField } from '@mui/material';
import React from 'react';
import { CountrySelector, usePhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface MuiPhoneInputProps {
  value: string;
  onChange: (phone: string) => void;
}

export const MuiPhoneInput: React.FC<MuiPhoneInputProps> = ({
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
                  margin: '0 4px 0 -4px',
                  padding: '2px',
                  minWidth: '0',
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
```

  </TabItem>

</Tabs>
