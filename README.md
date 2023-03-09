# react-international-phone

🤙 International phone input component for React

![npm-version](https://img.shields.io/npm/v/react-international-phone)
![build-status-badge](https://img.shields.io/github/actions/workflow/status/goveo/react-international-phone/release.yml?branch=master)
![install-size-badge](https://badgen.net/packagephobia/install/react-international-phone)
[![codecov](https://codecov.io/gh/goveo/react-international-phone/branch/master/graph/badge.svg?token=SHEF4U216O)](https://codecov.io/gh/goveo/react-international-phone)
![downloads](https://img.shields.io/npm/dt/react-international-phone)

[Live demo: Storybook](https://react-international-phone-storybook.vercel.app)

![demo-gif](https://user-images.githubusercontent.com/25800848/215350455-0d362e64-d621-4856-a384-ab18d4a0d5fa.gif)

## Features

- 😎 **Easy to integrate** - Just import and use, no need for the initial setup. Integrate with any UI library using a headless hook.
- 🔍 **Country guessing** - Just start typing and the component will guess the country and format the phone. Country flags are rendered using [Twemoji](https://twemoji.twitter.com/).
- ✨ **Lightweight** - Low bundle size, no third-party dependencies.
- 🌈 **Easy to customize** - Customize styles and component behavior using props.
- ⌨ **Caret position handling** - Typing in the middle of the input, selection and deletion feels naturally.
- ✔️ **Validation** - Easily validate entered phone numbers using provided functions.

## Installation

```sh
$ npm i react-international-phone
```

## Basic usage

```tsx
import { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const App = () => {
  const [phone, setPhone] = useState('');

  return (
    <div>
      <PhoneInput
        defaultCountry="ua"
        value={phone}
        onChange={(phone) => setPhone(phone)}
      />
    </div>
  );
};
```

## Documentation

Find the full API reference on [official documentation](https://react-international-phone-docs.vercel.app/).

## Update from v1 to v2

You can encounter some breaking changes after update from v1 to v2 <br/>
Checkout [migration document](https://react-international-phone-docs.vercel.app/docs/migration) that contains a list of breaking changes and ways to migrate.
