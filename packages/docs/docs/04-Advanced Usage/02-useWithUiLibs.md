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
import { IconButton, TextField } from '@mui/material';
import React from 'react';
import { CountrySelector, usePhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export const MuiPhone = ({ value, onChange }) => {
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
  );
};
```

  </TabItem>

  <TabItem value="tsx" label="TypeScript">

```tsx
import { IconButton, TextField } from '@mui/material';
import React from 'react';
import { CountrySelector, usePhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

interface PhoneInputProps {
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
  );
};
```

  </TabItem>

</Tabs>
