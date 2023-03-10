# Using with UI libraries

You can build phone input by combination of **input component** (that you want to be a phone input), [**usePhoneInput**](./usePhoneInput) hook and [**CountrySelector**](../Subcomponents%20API/CountrySelector).

**Ant Design** and **Chakra UI** examples can be found [on GitHub](https://github.com/goveo/react-international-phone/tree/master/src/stories/UiLibsExample/components) and demos for these code snippets can be found [on Storybook](https://react-international-phone-storybook.vercel.app/?path=/story/using-with-ui-libs).

## Material UI Example

import { MuiPhone } from '@site/src/components/MuiPhone'
import { useState } from 'react'

export const PhoneComponentWrapper = () => {
const [value, setValue] = useState('');
return <MuiPhone value={value} onChange={setValue}/>
};

<div style={{ margin: "3rem 0 2rem" }}>
  <PhoneComponentWrapper />
</div>

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>

<TabItem value="jsx" label="JavaScript">

```jsx
import 'react-international-phone/style.css';

import {
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import {
  defaultCountries,
  FlagEmoji,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';

export const MuiPhone = ({ value, onChange, ...restProps }) => {
  const { phone, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: 'us',
      value,
      countries: defaultCountries,
    });

  useEffect(() => {
    if (phone === value) return;
    onChange?.(phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  return (
    <TextField
      variant="outlined"
      label="Phone number"
      color="primary"
      placeholder="Phone number"
      value={phone}
      onChange={handlePhoneValueChange}
      type="tel"
      inputRef={inputRef}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            style={{ marginRight: '2px', marginLeft: '-8px' }}
          >
            <Select
              MenuProps={{
                style: {
                  height: '300px',
                  width: '360px',
                  top: '10px',
                  left: '-34px',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              }}
              sx={{
                width: 'max-content',
                // Remove default outline (display only on focus)
                fieldset: {
                  display: 'none',
                },
                '&.Mui-focused:has(div[aria-expanded="false"])': {
                  fieldset: {
                    display: 'block',
                  },
                },
                // Update default spacing
                '.MuiSelect-select': {
                  padding: '8px',
                  paddingRight: '24px !important',
                },
                svg: {
                  right: 0,
                },
              }}
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              renderValue={(value) => (
                <FlagEmoji iso2={value} style={{ display: 'flex' }} />
              )}
            >
              {defaultCountries.map((c) => {
                const country = parseCountry(c);
                return (
                  <MenuItem key={country.iso2} value={country.iso2}>
                    <FlagEmoji
                      iso2={country.iso2}
                      style={{ marginRight: '8px' }}
                    />
                    <Typography marginRight="8px">{country.name}</Typography>
                    <Typography color="gray">+{country.dialCode}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </InputAdornment>
        ),
      }}
      {...restProps}
    />
  );
};
```

  </TabItem>

  <TabItem value="tsx" label="TypeScript">

```tsx
import 'react-international-phone/style.css';

import {
  BaseTextFieldProps,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import React, { useEffect } from 'react';
import {
  CountryIso2,
  defaultCountries,
  FlagEmoji,
  parseCountry,
  usePhoneInput,
} from 'react-international-phone';

export interface MUIPhoneProps extends BaseTextFieldProps {
  value: string;
  onChange: (phone: string) => void;
}

export const MuiPhone: React.FC<MUIPhoneProps> = ({
  value,
  onChange,
  ...restProps
}) => {
  const { phone, handlePhoneValueChange, inputRef, country, setCountry } =
    usePhoneInput({
      defaultCountry: 'us',
      value,
      countries: defaultCountries,
    });

  useEffect(() => {
    if (phone === value) return;
    onChange?.(phone);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phone]);

  return (
    <TextField
      variant="outlined"
      label="Phone number"
      color="primary"
      placeholder="Phone number"
      value={phone}
      onChange={handlePhoneValueChange}
      type="tel"
      inputRef={inputRef}
      InputProps={{
        startAdornment: (
          <InputAdornment
            position="start"
            style={{ marginRight: '2px', marginLeft: '-8px' }}
          >
            <Select
              MenuProps={{
                style: {
                  height: '300px',
                  width: '360px',
                  top: '10px',
                  left: '-34px',
                },
                transformOrigin: {
                  vertical: 'top',
                  horizontal: 'left',
                },
              }}
              sx={{
                width: 'max-content',
                // Remove default outline (display only on focus)
                fieldset: {
                  display: 'none',
                },
                '&.Mui-focused:has(div[aria-expanded="false"])': {
                  fieldset: {
                    display: 'block',
                  },
                },
                // Update default spacing
                '.MuiSelect-select': {
                  padding: '8px',
                  paddingRight: '24px !important',
                },
                svg: {
                  right: 0,
                },
              }}
              value={country}
              onChange={(e) => setCountry(e.target.value as CountryIso2)}
              renderValue={(value) => (
                <FlagEmoji iso2={value} style={{ display: 'flex' }} />
              )}
            >
              {defaultCountries.map((c) => {
                const country = parseCountry(c);
                return (
                  <MenuItem key={country.iso2} value={country.iso2}>
                    <FlagEmoji
                      iso2={country.iso2}
                      style={{ marginRight: '8px' }}
                    />
                    <Typography marginRight="8px">{country.name}</Typography>
                    <Typography color="gray">+{country.dialCode}</Typography>
                  </MenuItem>
                );
              })}
            </Select>
          </InputAdornment>
        ),
      }}
      {...restProps}
    />
  );
};
```

  </TabItem>

</Tabs>
