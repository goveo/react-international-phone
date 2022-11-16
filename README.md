# react-international-phone

🤙 International phone input component for React

![demo](https://s4.gifyu.com/images/react-international-phone.gif)

![build-status](https://img.shields.io/github/workflow/status/goveo/react-international-phone/Release)

[Live demo: Storybook](https://react-international-phone-storybook.vercel.app)

## Features

- 😎 **Easy to integrate** - Just import and use, no need for the initial setup.
- 🔍 **Country guessing** - Just start typing and the component will guess the country.
- 🏳️ **Country flags** - Country flags are rendered using [Twemoji](https://twemoji.twitter.com/).
- ⌨ **Caret position handling** - Typing in the middle of the input, selection and deletion feels naturally.
- ✨ **Lightweight** - Low bundle size, no third-party dependencies.
- 🌈 **Easy to customize** - Customize styles and component behavior using props.

## Installation

```sh
$ npm i react-international-phone
```

## Basic usage

```tsx
import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';

const App = () => {
  const [phone, setPhone] = useState('');

  return (
    <div>
      <PhoneInput
        initialCountry="ua"
        value={phone}
        onChange={(phone) => setPhone(phone)}
      />
    </div>
  );
};
```

## Documentation

Find the full API reference on [official documentation](https://react-international-phone-docs.vercel.app/).
