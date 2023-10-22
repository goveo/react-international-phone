import React from 'react';

import { defaultCountries, parseCountry, PhoneInput } from '../../../index';
import { CustomFlagImage } from '../../../types';
import { PhoneInputStory } from '../PhoneInput.stories';

const flags: CustomFlagImage[] = [
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

const countries = defaultCountries.filter((c) => {
  const country = parseCountry(c);

  return flags.map((f) => f.iso2).includes(country.iso2);
});

export const CustomFlags: PhoneInputStory = {
  name: 'Without Dropdown',
  render: (args) => <PhoneInput {...args} />,
  args: {
    flags,
    countries,
    style: {
      // style with css variables or with ".react-international-phone-flag-emoji" class
      '--react-international-phone-flag-width': '24px',
      '--react-international-phone-flag-height': '24px',
    } as React.CSSProperties,
    defaultCountry: 'jp',
    placeholder: 'Phone number',
  },
};
