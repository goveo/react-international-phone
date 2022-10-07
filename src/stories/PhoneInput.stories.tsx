import { boolean, select, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import { PhoneInput as PhoneInputComponent } from '../components/PhoneInput/PhoneInput';
import { countries } from '../data/countryData';
import { parseCountry } from '../utils';

export default {
  title: 'PhoneInput',
  decorators: [withKnobs],
};

export const Base = () => {
  const disableDropdown = boolean('Disable dropdown', false);
  const initialCountry = select(
    'Initial country',
    countries.map((c) => {
      return parseCountry(c).iso2;
    }),
    'us',
  );

  return (
    <PhoneInputComponent
      disableDropdown={disableDropdown}
      initialCountry={initialCountry}
    />
  );
};
