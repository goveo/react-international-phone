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
