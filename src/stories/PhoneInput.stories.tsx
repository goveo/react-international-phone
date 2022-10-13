import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { PhoneInput } from '../components/PhoneInput/PhoneInput';
import { countries } from '../data/countryData';
import { parseCountry } from '../utils';

export default {
  title: 'PhoneInput',
  component: PhoneInput,
} as ComponentMeta<typeof PhoneInput>;

const Template: ComponentStory<typeof PhoneInput> = (args) => (
  <PhoneInput {...args} />
);

export const Base = Template.bind({});

Base.argTypes = {
  initialCountry: {
    options: countries.map((c) => parseCountry(c).iso2),
    control: {
      type: 'select',
      labels: countries.reduce((acc: Record<string, string>, c) => {
        const { name, iso2 } = parseCountry(c);
        acc[iso2] = `${name} (${iso2})`;
        return acc;
      }, {}),
    },
  },
};

Base.args = {
  disableDropdown: false,
  initialCountry: 'us',
  placeholder: 'Phone number',
  defaultMask: '............',
  insertSpaceAfterDialCode: true,
  disableCountryGuess: false,
  disableDialCodePrefill: false,
};
