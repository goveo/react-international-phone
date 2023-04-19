# Phone validation

You can validate the entered phone number by using `usePhoneValidation` hook or `validatePhone` function.

:::note
`usePhoneValidation` is just a wrapper over `validatePhone` function and does not provide additional functionality.
:::

The validation function requires the passing of `phone` value and can be configured with passing a config object:

```tsx
const phoneValidation = usePhoneValidation('+1 (123) 456-7890', {
  // optional configuration
  prefix: '+',
  charAfterDialCode: ' ',
  defaultMask: '............',
  defaultMaskMinPhoneLength: 10,
  countries: defaultCountries,
});
```

## Validation config

To apply validation correctly you should sync `defaultMask`, `countries`, `prefix` and `charAfterDialCode` from validation config with values that you pass to [`<PhoneInput />`](/docs/Usage/PhoneInput#properties).

Validation behavior on countries with default masks can be slightly adjusted with `defaultMaskMinPhoneLength`.

| Prop                      | Type            | Description                                                                                                                                            | Default value               |
| ------------------------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------- |
| country                   | `CountryIso2`   | Forced country to validate.                                                                                                                            | `undefined`                 |
| defaultMaskMinPhoneLength | `number`        | Required phone length for countries without specified mask. Validation will fail if number of digits in phone value will be less that provided number. | `10`                        |
| defaultMask               | `string`        | Mask for countries without specified mask.                                                                                                             | `"............"` (12 chars) |
| countries                 | `CountryData[]` | An array of available countries.                                                                                                                       | `defaultCountries`          |
| prefix                    | `string`        | Prefix for phone value.                                                                                                                                | `"+"`                       |
| charAfterDialCode         | `string`        | Phone value.                                                                                                                                           | `" "`                       |

## Returned values

| Prop          | Type                                  | Description                                |
| ------------- | ------------------------------------- | ------------------------------------------ |
| isValid       | `boolean`                             | Is phone valid.                            |
| country       | <code>CountryData \| undefined</code> | Parsed country from provided phone value.  |
| lengthMatch   | `boolean`                             | Is phone length match required value.      |
| areaCodeMatch | `boolean`                             | Is country area code exists.               |
| dialCodeMatch | `boolean`                             | Is country dial code match parsed country. |
| formatMatch   | `boolean`                             | Is formatting applied correctly.           |

:::note
`isValid` is not depend on `areaCodeMatch` and `formatMatch`.
If you want to check dial codes and the formatting strictly you can add an additional check:

```ts
const phoneValidation = usePhoneValidation('+1 (123) 456-7890');
const isPhoneValid =
  phoneValidation.isValid &&
  phoneValidation.areaCodeMatch &&
  phoneValidation.formatMatch;
```

:::

:::caution
`isValid` does **not guarantee** that the entered phone number **is 100% valid**.<br/>

When `isValid` value becomes **true** it shows that the country was parsed from the provided phone value and has required amount of digits.
:::

### Dial codes overlap issue

:::danger
**Country value can be parsed incorrectly sometimes** <br/>
It can happen when the country of provided phone value shares the same dial code with another country, but have a lower priory. For example, if user selects a _Vatican City_ and types a phone number like `+39 99 9999 9999` it will be validated as _Italy_ by default.
:::

This issue can happen with following countries:

- `+1` United States, Canada, Dominican Republic, Puerto Rico
- `+559` Curaçao, Caribbean Netherlands
- `+39` Italy, Vatican City,
- `+7` Kazakhstan, Russia

To prevent this issue you can save the selected country value to the local state and pass it to the **country** validation property:

```tsx
const [phone, setPhone] = useState('');
// highlight-start
const [currentCountry, setCurrentCountry] = useState<CountryIso2>('ua');
const validation = usePhoneValidation(phone, { country: currentCountry });
// highlight-end

return (
  <PhoneInput
    defaultCountry="ua"
    value={phone}
    onChange={(phone, country) => {
      setPhone(phone);
      // highlight-start
      setCurrentCountry(country);
      // highlight-end
    }}
  />
);
```

## Basic Usage

```tsx
import { useState } from 'react';
import { PhoneInput, usePhoneValidation } from 'react-international-phone';
import 'react-international-phone/style.css';

const App = () => {
  const [phone, setPhone] = useState('');
  // highlight-start
  const phoneValidation = usePhoneValidation(phone);
  // highlight-end

  return (
    <form
      onSubmit={(e) => {
        // some submit logic
        e.preventDefault();
        alert(`Submitted phone: ${phone}`);
      }}
    >
      <PhoneInput
        defaultCountry="ua"
        value={phone}
        onChange={(phone) => setPhone(phone)}
      />
      <button
        // highlight-start
        disabled={!phoneValidation.isValid}
        // highlight-end
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};
```

import { useState } from 'react'
import { PhoneInput, usePhoneValidation } from 'react-international-phone';

export const Example = () => {
const [phone, setPhone] = useState('');
const phoneValidation = usePhoneValidation(phone);
return (<form
onSubmit={(e) => {
e.preventDefault();
alert(`Submitted phone: ${phone}`);
}} >
<PhoneInput
defaultCountry="ua"
value={phone}
onChange={(phone) => setPhone(phone)}
/>
<button
disabled={!phoneValidation.isValid}
type="submit" >
Submit
</button></form>);
};

Output:

<div style={{ margin: "8px 0 24px" }}>
<Example />
</div>
