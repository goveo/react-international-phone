# Modify countries

You can define your own country list for **PhoneInput**.
Just import `defaultCountries` and update it how you want.

## Example

```tsx
import { useState } from 'react';
import {
  PhoneInput,
  // highlight-start
  defaultCountries,
  parseCountry,
  // highlight-end
} from 'react-international-phone';

// highlight-start
const countries = defaultCountries.filter((country) => {
  const { iso2 } = parseCountry(country);
  return ['us', 'ua', 'gb'].includes(iso2);
});
// highlight-end

const App = () => {
  const [phone, setPhone] = useState('');

  return (
    <div>
      <PhoneInput
        defaultCountry="ua"
        phone={phone}
        onChange={setPhone}
        // highlight-start
        countries={countries}
        // highlight-end
      />
    </div>
  );
};
```

Output:

import { PhoneInput, defaultCountries, parseCountry, } from 'react-international-phone'
const countries = defaultCountries.filter((country) => {
const { iso2 } = parseCountry(country);
return ['us', 'ua', 'gb'].includes(iso2);
});

<PhoneInput
  defaultCountry="ua"
  countries={countries}
/>

## Country Data Type

Each country in `defaultCountries` follows this format:

```ts
[
  string, // country name
  CountryIso2, // iso2 code
  string, // international dial code
  string, // format (optional)
  number, // order priority (optional)
  string[], // area codes (optional)
]
```

You can use these data to filter/modify country list.

```ts
const [name, iso2, dialCode, format, priority, areaCodes] = defaultCountries[0];
```

:::tip

You can use the `parseCountry` helper function to convert the country data array to an object, modify it in some way, and build back with `buildCountryData`

```ts
const lowercasedCountries = defaultCountries.map((country) => {
  const parsedCountry = parseCountry(country);
  // lowercase country names, for example
  parsedCountry.name = parsedCountry.name.toLowerCase();

  return buildCountryData(parsedCountry);
});
```

:::

Country data was taken from [react-phone-input-2](https://github.com/bl00mber/react-phone-input-2/blob/master/src/rawCountries.js) :pray:
