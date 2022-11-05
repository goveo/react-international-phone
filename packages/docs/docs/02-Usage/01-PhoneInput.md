# PhoneInput API

**PhoneInput** is a highly customizable phone input component.

## Usage Example

Import component

```tsx
export { PhoneInput } from 'react-international-phone';
```

Use by providing the _initialCountry_, _phone_ and _onChange_ callback.

```tsx
<PhoneInput initialCountry="ua" phone={phone} onChange={setPhone} />
```

Output:

import { PhoneInput } from 'react-international-phone';

<PhoneInput
initialCountry="ua"
inputProps={{ autoFocus: true }}
/>

## Properties

| Prop                          | Type                  | Description                                                                                                                                                                                                          | Default value               |
| ----------------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| initialCountry `(required)`   | `CountryIso2`         | Initial country value (iso2).                                                                                                                                                                                        |                             |
| initialPhone                  | `string`              | Initial phone value.                                                                                                                                                                                                 | `""`                        |
| countries                     | `CountryData[]`       | An array of available countries to select (and guess)                                                                                                                                                                | `defaultCountries`          |
| hideDropdown                  | `boolean`             | Hide the dropdown icon. Make country selection not accessible.                                                                                                                                                       | `false`                     |
| placeholder                   | `string`              | Input's placeholder                                                                                                                                                                                                  | `undefined`                 |
| disabled                      | `boolean`             | Disable phone input and country selector.                                                                                                                                                                            | `false`                     |
| prefix                        | `string`              | Prefix for phone value.                                                                                                                                                                                              | `"+"`                       |
| defaultMask                   | `string`              | This mask will apply on countries that does not have specified mask.                                                                                                                                                 | `"............"` (12 chars) |
| hideSpaceAfterDialCode        | `boolean`             | Hide space after country dial code                                                                                                                                                                                   | `false`                     |
| historySaveDebounceMS         | `number`              | Save value to history if there were not any changes in provided milliseconds timeslot.<br />Undo/redo (ctrl+z/ctrl+shif+z) works only with values that are saved in history                                          | `200`                       |
| disableCountryGuess           | `boolean`             | Disable country guess on value change.<br />- _onCountryGuess_ callback would not be called.                                                                                                                         | `false`                     |
| disableDialCodePrefill        | `boolean`             | Disable dial code prefill on initialization.<br />Dial code prefill works only when "empty" phone value have been provided.                                                                                          | `false`                     |
| forceDialCode                 | `boolean`             | Always display the dial code.<br />Dial code can't be removed/changed by keyboard events, but it can be changed by pasting another country phone value.                                                              | `false`                     |
| disableDialCodeAndPrefix      | `boolean`             | Phone value will not include passed _dialCode_ and _prefix_ if set to _true_.<br />- _disableCountryGuess_ value will be ignored and set to _true_.<br />- _forceDialCode_ value will be ignored and set to _false_. | `false`                     |
| showDisabledDialCodeAndPrefix | `boolean`             | Show prefix and dial code between country selector and phone input.<br />- Works only when _disableDialCodeAndPrefix_ is _true_                                                                                      | `false`                     |
| inputProps                    | `InputHTMLAttributes` | Default input component props                                                                                                                                                                                        | `undefined`                 |

## Events

| Event    | Type                      | Description                         |
| -------- | ------------------------- | ----------------------------------- |
| onChange | `(phone: string) => void` | Callback that calls on phone change |

Input events like **`onFocus`** and **`onBlur`** can be passed to the `inputProps`

## Style properties

| Prop                      | Type                                                      | Description                                   |
| ------------------------- | --------------------------------------------------------- | --------------------------------------------- |
| style                     | `CSSProperties`                                           | Custom styles for **PhoneInput container**    |
| className                 | `string`                                                  | Custom className for **PhoneInput container** |
| inputStyle                | `CSSProperties`                                           | Custom styles for **input field**             |
| inputClassName            | `string`                                                  | Custom className for **input field**          |
| countrySelectorStyleProps | [`CountrySelectorStyleProps`](#CountrySelectorStyleProps) | Style properties for **country selector**     |
| dialCodePreviewStyleProps | [`DialCodePreviewStyleProps`](#DialCodePreviewStyleProps) | Style properties for **dial code preview**    |

## CSS variables

| Variable                                              | Default value |
| ----------------------------------------------------- | ------------- |
| --react-international-phone-height                    | `36px`        |
| --react-international-phone-background-color          | `white`       |
| --react-international-phone-text-color                | `#222`        |
| --react-international-phone-font-size                 | `13px`        |
| --react-international-phone-border-radius             | `4px `        |
| --react-international-phone-border-color              | `gainsboro`   |
| --react-international-phone-disabled-background-color | `whitesmoke`  |
| --react-international-phone-disabled-text-color       | `#666`        |
