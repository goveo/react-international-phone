# react-international-phone

🤙 International phone component for react

![demo](https://s4.gifyu.com/images/react-international-phone.gif)

![build-status](https://img.shields.io/github/workflow/status/goveo/react-international-phone/Release)

## Installation

```sh
$ npm install --save react-international-phone
$ yarn add react-international-phone
```

## Usage

```tsx
import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';

const App = () => {
  const [phone, setPhone] = useState('');

  return (
    <div>
      <PhoneInput initialCountry="ua" phone={phone} onChange={setPhone} />
    </div>
  );
};
```

## Features

- 😎 **Easy to integrate** - HTML input under the hood
- 🔍 **Country guessing** - Just start typing and component will guess the country
- 🏳️ **Country flag render** - Render flags using [Twemoji](https://twemoji.twitter.com/)
- ⌨ **Cursor position handling** - Typing in the middle of input value feels naturally
- ✨ **Lightweight** - no third-party dependencies

## PhoneInput component

### Properties

| Prop                          | Required | Type                | Description                                                                                                                                                                                                      | Default value              |
| ----------------------------- | -------- | ------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| initialCountry                | +        | CountryIso2         | Initial country value (iso2).                                                                                                                                                                                    |                            |
| initialPhone                  | -        | string              | Initial phone value.                                                                                                                                                                                             | ""                         |
| hideDropdown                  | -        | boolean             | Hide the dropdown icon. Make country selection not accessible.                                                                                                                                                   | false                      |
| placeholder                   | -        | string              | Input's placeholder                                                                                                                                                                                              | undefined                  |
| disabled                      | -        | boolean             | Disable phone input and country selector.                                                                                                                                                                        | false                      |
| prefix                        | -        | string              | Prefix for phone value.                                                                                                                                                                                          | "+"                        |
| defaultMask                   | -        | string              | This mask will apply on countries that does not have specified mask.                                                                                                                                             | "............" // 12 chars |
| hideSpaceAfterDialCode        | -        | boolean             | Hide space after country dial code                                                                                                                                                                               | false                      |
| historySaveDebounceMS         | -        | number              | Save value to history if there were not any changes in provided milliseconds timeslot.<br>Undo/redo (ctrl+z/ctrl+shif+z) works only with values that are saved in history                                        | 200                        |
| disableCountryGuess           | -        | boolean             | Disable country guess on value change.<br>- _onCountryGuess_ callback would not be called.                                                                                                                       | false                      |
| disableDialCodePrefill        | -        | boolean             | Disable dial code prefill on initialization.<br>Dial code prefill works only when "empty" phone value have been provided.                                                                                        | false                      |
| forceDialCode                 | -        | boolean             | Always display the dial code.<br>Dial code can't be removed/changed by keyboard events, but it can be changed by pasting another country phone value.                                                            | false                      |
| disableDialCodeAndPrefix      | -        | boolean             | Phone value will not include passed _dialCode_ and _prefix_ if set to _true_.<br>- _disableCountryGuess_ value will be ignored and set to _true_.<br>- _forceDialCode_ value will be ignored and set to _false_. | false                      |
| showDisabledDialCodeAndPrefix | -        | boolean             | Show prefix and dial code between country selector and phone input.<br>- Works only when _disableDialCodeAndPrefix_ is _true_                                                                                    | false                      |
| inputProps                    | -        | InputHTMLAttributes | Default input component props                                                                                                                                                                                    | undefined                  |

### Events

| Event    | Required | Type                    | Description                         |
| -------- | -------- | ----------------------- | ----------------------------------- |
| onChange | -        | (phone: string) => void | Callback that calls on phone change |

Input events like **onFocus** and **onBlur** can be passed to the _inputProps_

### Style properties

| Prop                      | Required | Type                                                    | Description                                   | Default value |
| ------------------------- | -------- | ------------------------------------------------------- | --------------------------------------------- | ------------- |
| style                     | -        | CSSProperties                                           | Custom styles for **PhoneInput container**    | undefined     |
| className                 | -        | string                                                  | Custom className for **PhoneInput container** | undefined     |
| inputStyle                | -        | CSSProperties                                           | Custom styles for **input field**             | undefined     |
| inputClassName            | -        | string                                                  | Custom className for **input field**          | undefined     |
| countrySelectorStyleProps | -        | [CountrySelectorStyleProps](#CountrySelectorStyleProps) | Style properties for **country selector**     | undefined     |
| dialCodePreviewStyleProps | -        | [DialCodePreviewStyleProps](#DialCodePreviewStyleProps) | Style properties for **dial code preview**    | undefined     |

### CSS variables

| Variable                                              | Default value |
| ----------------------------------------------------- | ------------- |
| --react-international-phone-height                    | 36px          |
| --react-international-phone-background-color          | white         |
| --react-international-phone-text-color                | #222          |
| --react-international-phone-font-size                 | 13px          |
| --react-international-phone-border-radius             | 4px           |
| --react-international-phone-border-color              | gainsboro     |
| --react-international-phone-disabled-background-color | whitesmoke    |
| --react-international-phone-disabled-text-color       | #666          |

## CountrySelector component

### Properties

| Prop            | Required | Type        | Description                                               | Default value |
| --------------- | -------- | ----------- | --------------------------------------------------------- | ------------- |
| selectedCountry | -        | CountryIso2 | Selected country (iso2)                                   | undefined     |
| disabled        | -        | boolean     | Is CountrySelector disabled                               | undefined     |
| hideDropdown    | -        | boolean     | Hide dropdown icon and make CountrySelector not clickable | undefined     |

### Events

| Prop     | Required | Type                             | Description                           | Default value |
| -------- | -------- | -------------------------------- | ------------------------------------- | ------------- |
| onSelect | -        | (country: ParsedCountry) => void | Callback that calls on country select | undefined     |

### <a name="CountrySelectorStyleProps">Style properties (CountrySelectorStyleProps type)</a>

| Prop                   | Required | Type                                                                    | Description                                             | Default value |
| ---------------------- | -------- | ----------------------------------------------------------------------- | ------------------------------------------------------- | ------------- |
| style                  | -        | CSSProperties                                                           | Custom styles for **CountrySelector container**         | undefined     |
| className              | -        | string                                                                  | Custom className for **CountrySelector container**      | undefined     |
| buttonStyle            | -        | CSSProperties                                                           | Custom styles for **CountrySelector button**            | undefined     |
| buttonClassName        | -        | string                                                                  | Custom className for **CountrySelector button**         | undefined     |
| flagStyle              | -        | dropdownStyleProps                                                      | Custom styles for **CountrySelector flag**              | undefined     |
| flagClassName          | -        | string                                                                  | Custom className for **CountrySelector flag**           | undefined     |
| dropdownArrowStyle     | -        | dropdownStyleProps                                                      | Custom styles for **CountrySelector dropdown arrow**    | undefined     |
| dropdownArrowClassName | -        | string                                                                  | Custom className for **CountrySelector dropdown arrow** | undefined     |
| dropdownStyleProps     | -        | [CountrySelectorDropdownStyleProps](#CountrySelectorDropdownStyleProps) | Style properties for **CountrySelector dropdown**       | undefined     |

### CSS variables

| Variable                                                               | Default value                                         |
| ---------------------------------------------------------------------- | ----------------------------------------------------- |
| --react-international-phone-country-selector-background-color          | --react-international-phone-background-color          |
| --react-international-phone-country-selector-background-color-hover    | whitesmoke                                            |
| --react-international-phone-disabled-country-selector-background-color | --react-international-phone-disabled-background-color |
| --react-international-phone-country-selector-border-color              | 13px                                                  |
| --react-international-phone-country-selector-arrow-size                | 4px                                                   |
| --react-international-phone-country-selector-arrow-color               | #777                                                  |
| --react-international-phone-disabled-country-selector-arrow-color      | #999                                                  |

## CountrySelectorDropdown component

### Properties

| Prop            | Required | Type        | Description                         | Default value |
| --------------- | -------- | ----------- | ----------------------------------- | ------------- |
| show            | +        | boolean     | Show dropdown                       |               |
| dialCodePrefix  | -        | string      | Prefix for country code             | "+"           |
| selectedCountry | -        | CountryIso2 | Selected option country code (iso2) | undefined     |

### Events

| Prop           | Required | Type                             | Description                                      | Default value |
| -------------- | -------- | -------------------------------- | ------------------------------------------------ | ------------- |
| onSelect       | -        | (country: ParsedCountry) => void | Callback that calls on option select             | undefined     |
| onClickOutside | -        | () => void                       | Callback that calls on outside click             | undefined     |
| onEscapePress  | -        | () => void                       | Callback that calls on escape keyboard key press | undefined     |

### <a name="CountrySelectorDropdownStyleProps">Style properties (CountrySelectorDropdownStyleProps type)</a>

| Prop                         | Required | Type          | Description                                                                  | Default value |
| ---------------------------- | -------- | ------------- | ---------------------------------------------------------------------------- | ------------- |
| style                        | -        | CSSProperties | Custom styles for **CountrySelectorDropdown container**                      | undefined     |
| className                    | -        | string        | Custom className for **CountrySelectorDropdown container**                   | undefined     |
| listItemStyle                | -        | CSSProperties | Custom styles for **CountrySelectorDropdown list-item container**            | undefined     |
| listItemClassName            | -        | string        | Custom className for **CountrySelectorDropdown list-item container**         | undefined     |
| listItemFlagStyle            | -        | CSSProperties | Custom styles for **CountrySelectorDropdown list-item flag**                 | undefined     |
| listItemFlagClassName        | -        | string        | Custom className for **CountrySelectorDropdown list-item flag**              | undefined     |
| listItemCountryNameStyle     | -        | CSSProperties | Custom styles for **CountrySelectorDropdown list-item country name**         | undefined     |
| listItemCountryNameClassName | -        | string        | Custom className for **CountrySelectorDropdown list-item country name**      | undefined     |
| listItemDialCodeStyle        | -        | CSSProperties | Custom styles for **CountrySelectorDropdown list-item country dial code**    | undefined     |
| listItemDialCodeClassName    | -        | string        | Custom className for **CountrySelectorDropdown list-item country dial code** | undefined     |

### CSS variables

| Variable                                                            | Default value                                            |
| ------------------------------------------------------------------- | -------------------------------------------------------- |
| --react-international-phone-dropdown-item-font-size                 | 14px                                                     |
| --react-international-phone-dropdown-item-text-color                | --react-international-phone-text-color                   |
| --react-international-phone-dropdown-item-background-color          | --react-international-phone-background-color             |
| --react-international-phone-dropdown-item-dial-code-color           | gray                                                     |
| --react-international-phone-selected-dropdown-item-text-color       | --react-international-phone-text-color                   |
| --react-international-phone-selected-dropdown-item-background-color | whitesmoke                                               |
| --react-international-phone-selected-dropdown-item-dial-code-color  | -react-international-phone-dropdown-item-dial-code-color |
| --react-international-phone-dropdown-shadow                         | 2px 2px 16px rgb(0 0 0 / 25%)                            |

## DialCodePreview component

### Properties

| Prop     | Required | Type    | Description              | Default value |
| -------- | -------- | ------- | ------------------------ | ------------- |
| dialCode | +        | string  | Country dial code (iso2) |               |
| prefix   | +        | string  | Dial code prefix         |               |
| disabled | -        | boolean | Is component disabled    | undefined     |

### <a name="DialCodePreviewStyleProps">Style properties (DialCodePreviewStyleProps type)</a>

| Prop      | Required | Type          | Description                                        | Default value |
| --------- | -------- | ------------- | -------------------------------------------------- | ------------- |
| style     | -        | CSSProperties | Custom styles for **DialCodePreview container**    | undefined     |
| className | -        | string        | Custom className for **DialCodePreview container** | undefined     |

### CSS variables

| Variable                                                                | Default value                                         |
| ----------------------------------------------------------------------- | ----------------------------------------------------- |
| --react-international-phone-dial-code-preview-background-color          | --react-international-phone-background-color          |
| --react-international-phone-dial-code-preview-border-color              | --react-international-phone-border-color              |
| --react-international-phone-dial-code-preview-text-color                | --react-international-phone-text-color                |
| --react-international-phone-dial-code-preview-font-size                 | --react-international-phone-font-size                 |
| --react-international-phone-dial-code-preview-disabled-background-color | --react-international-phone-disabled-background-color |
| --react-international-phone-dial-code-preview-disabled-text-color       | --react-international-phone-disabled-text-color       |
