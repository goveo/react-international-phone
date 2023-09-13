import React from 'react';

import {
  CountryIso2,
  defaultCountries,
  parseCountry,
  PhoneInput,
} from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

const balticCountries: CountryIso2[] = ['lt', 'lv', 'ee'];

export const OnlyBalticCountries: PhoneInputStory = {
  name: 'Only Baltic Countries',
  render: (args) => <PhoneInput {...args} />,
  args: {
    defaultCountry: 'lt',
    countries: defaultCountries.filter((c) => {
      return balticCountries.includes(parseCountry(c).iso2);
    }),
  },
};
