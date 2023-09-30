# Get active country mask

You can get current country formatting mask using `getActiveFormattingMask` function.

:::warning
You should not use raw `country.format` value because it will be an object if active country has a dynamic formatting mask.
:::

## Basic example

```tsx
import { PhoneInput, getActiveFormattingMask } from 'react-international-phone';

const App = () => {
  const [phone, setPhone] = useState('');

  return (
    <PhoneInput
      value={phone}
      onChange={(phone, { country }) => {
        setPhone(phone);
        // highlight-start
        const mask = getActiveFormattingMask({ phone, country });
        // highlight-end
        // use formatting mask for your purposes
      })}
    />
  )
}
```

- `phone` should be in a E.164 format
- `country` should be a parsed country object

## Config properties

You must provide same `prefix`, `defaultMask` or `disableFormatting` properties to `getActiveFormattingMask` if you have provided them to `PhoneInput`

```tsx
getActiveFormattingMask({
  country,
  phone,
  prefix: '+',
  defaultMask: '............',
  disableFormatting: false,
});
```
