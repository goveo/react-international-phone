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

const App = () => {
  const [phone, setPhone] = useState('');

  return (
    <div>
      <PhoneInput initialCountry="ua" phone={phone} onChange={setPhone} />
    </div>
  );
};
```
