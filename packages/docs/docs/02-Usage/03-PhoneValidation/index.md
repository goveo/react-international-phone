# Phone validation

`react-international-phone` is not providing validation functionality anymore.

To validate phone number we recommend to use a [`google-libphonenumber`](https://www.npmjs.com/package/google-libphonenumber) library.<br/>
There is how you can create a validator function:

```ts
import { PhoneNumberUtil } from 'google-libphonenumber';

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};
```

## Basic Example

```tsx
import { PhoneNumberUtil } from 'google-libphonenumber';
import React, { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

const phoneUtil = PhoneNumberUtil.getInstance();

const isPhoneValid = (phone: string) => {
  try {
    return phoneUtil.isValidNumber(phoneUtil.parseAndKeepRawInput(phone));
  } catch (error) {
    return false;
  }
};

const App = () => {
  const [phone, setPhone] = useState('');
  // highlight-start
  const isValid = isPhoneValid(phone);
  // highlight-end

  return (
    <form
      onSubmit={(e) => {
        // some submit logic
        e.preventDefault();
        alert(`Submitted phone: ${phone}`);
      }}
    >
      <PhoneInput
        defaultCountry="ua"
        value={phone}
        onChange={(phone) => setPhone(phone)}
      />

      {/* highlight-start */}
      {!isValid && <div style={{ color: 'red' }}>Phone is not valid</div>}
      {/* highlight-end */}

      <button
        // highlight-start
        disabled={!isValid}
        // highlight-end
        type="submit"
      >
        Submit
      </button>
    </form>
  );
};
```

Output:

import PhoneValidationExample from './PhoneValidationExample'

<PhoneValidationExample />
