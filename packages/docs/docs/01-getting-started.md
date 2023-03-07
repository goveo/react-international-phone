---
sidebar_position: 1
---

# Getting Started

## Installation

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>

<TabItem value="npm" label="npm">

```shell
npm install react-international-phone
```

</TabItem>

<TabItem value="yarn" label="yarn">

```shell
yarn add react-international-phone
```

</TabItem>

<TabItem value="pnpm" label="pnpm">

```shell
pnpm add react-international-phone
```

</TabItem>

</Tabs>

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

:::note

Don't forget to import default styles when using UI components

```ts
import 'react-international-phone/style.css';
```

:::
