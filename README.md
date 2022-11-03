# react-international-phone

🤙 International phone component for react

![demo](https://s4.gifyu.com/images/react-international-phone.gif)

![build-status](https://img.shields.io/github/workflow/status/goveo/react-international-phone/Release)

[Live demo: Storybook](https://react-international-phone-storybook.vercel.app)

## Features

- 😎 **Easy to integrate** - HTML input under the hood
- 🔍 **Country guessing** - Just start typing and component will guess the country
- 🏳️ **Country flag render** - Render flags using [Twemoji](https://twemoji.twitter.com/)
- ⌨ **Cursor position handling** - Typing in the middle of input value feels naturally
- ✨ **Lightweight** - no third-party dependencies

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
