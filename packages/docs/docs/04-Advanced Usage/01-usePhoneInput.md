import RequiredMark from '@site/src/components/RequiredMark'

# usePhoneInput

**usePhoneInput** is a hook for providing phone formatting to existing input components.

Use `phone` (as value), `handlePhoneValueChange` (as onChange callback) and `inputRef` (as passed ref) to handle input.

## Usage Example

```ts
// import { usePhoneInput } from 'react-international-phone';

const { country, setCountry, phone, handlePhoneValueChange, inputRef } =
  usePhoneInput({
    defaultCountry: 'us',
    value: '+1 (234)',
    onChange: ({ phone, country }) => {
      // make something on change
    },
  });
```

## Hook arguments

| Argument                        | Type                                                      | Description                                                                                                                                                                                                          | Default value               |
| ------------------------------- | --------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| defaultCountry <RequiredMark /> | `CountryIso2`                                             | Default country value (iso2).                                                                                                                                                                                        |                             |
| value                           | `string`                                                  | Phone value.                                                                                                                                                                                                         | `""`                        |
| countries                       | `CountryData[]`                                           | An array of available countries to select (and guess).                                                                                                                                                               | `defaultCountries`          |
| prefix                          | `string`                                                  | Prefix for phone value.                                                                                                                                                                                              | `"+"`                       |
| defaultMask                     | `string`                                                  | This mask will apply on countries that does not have specified mask.                                                                                                                                                 | `"............"` (12 chars) |
| charAfterDialCode               | `string`                                                  | Char that renders after country dial code.                                                                                                                                                                           | ` `                         |
| historySaveDebounceMS           | `number`                                                  | Save value to history if there were not any changes in provided milliseconds timeslot.<br />Undo/redo (ctrl+z/ctrl+shif+z) works only with values that are saved in history.                                         | `200`                       |
| disableCountryGuess             | `boolean`                                                 | Disable country guess on value change.<br />- _onCountryGuess_ callback would not be called.                                                                                                                         | `false`                     |
| disableDialCodePrefill          | `boolean`                                                 | Disable dial code prefill on initialization.<br />Dial code prefill works only when "empty" phone value have been provided.                                                                                          | `false`                     |
| forceDialCode                   | `boolean`                                                 | Always display the dial code.<br />Dial code can't be removed/changed by keyboard events, but it can be changed by pasting another country phone value.                                                              | `false`                     |
| disableDialCodeAndPrefix        | `boolean`                                                 | Phone value will not include passed _dialCode_ and _prefix_ if set to _true_.<br />- _disableCountryGuess_ value will be ignored and set to _true_.<br />- _forceDialCode_ value will be ignored and set to _false_. | `false`                     |
| onChange                        | `(data: { phone: string; country: CountryIso2 }) => void` | Callback that calls on phone change                                                                                                                                                                                  | `undefined`                 |

## Returned values

| Value                  | Type                                                 | Description                                                                   |
| ---------------------- | ---------------------------------------------------- | ----------------------------------------------------------------------------- |
| phone                  | `string`                                             | Formatted phone string.                                                       |
| handlePhoneValueChange | `(e: React.ChangeEvent<HTMLInputElement>) => string` | Change handler for input component.                                           |
| inputRef               | `React.RefObject<HTMLInputElement>`                  | Ref object for input component (handles caret position, focus and undo/redo). |
| country                | `CountryIso2`                                        | Current country iso code.                                                     |
| setCountry             | `(country: CountryIso2) => void`                     | Country setter.                                                               |
