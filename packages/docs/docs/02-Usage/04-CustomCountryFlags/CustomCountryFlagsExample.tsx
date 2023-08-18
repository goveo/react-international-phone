import 'react-international-phone/style.css';

import React, { useState } from 'react';
import {
  defaultCountries,
  parseCountry,
  PhoneInput,
} from 'react-international-phone';

const customFlags = [
  {
    iso2: 'ua',
    src: '/flags/ua.svg',
  },
  {
    iso2: 'fr',
    src: '/flags/fr.svg',
  },
  {
    iso2: 'jp',
    src: '/flags/jp.svg',
  },
  {
    iso2: 'pl',
    src: '/flags/pl.svg',
  },
];

const App = () => {
  const [phone, setPhone] = useState('');

  return (
    <PhoneInput
      countries={defaultCountries.filter((c) => {
        const country = parseCountry(c);

        return customFlags.map((f) => f.iso2).includes(country.iso2);
      })}
      flags={customFlags}
      style={
        {
          // style with css variables or with ".react-international-phone-flag-emoji" class
          '--react-international-phone-flag-width': '24px',
          '--react-international-phone-flag-height': '15px',
        } as React.CSSProperties
      }
      value={phone}
      onChange={setPhone}
      defaultCountry="jp"
      placeholder="Phone number"
    />
  );
};

export default App;
