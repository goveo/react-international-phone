---
sidebar_position: 1
---

# Getting Started

## Installation

```sh
npm i react-international-phone
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
        initialCountry="ua"
        value={phone}
        onChange={(phone) => setPhone(phone)}
      />
    </div>
  );
};
```

:::note

Don't forget to import default styles when using UI components

```ts
import 'react-international-phone/style.css';
```

:::
