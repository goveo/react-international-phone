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

const initialCountryArgType = {
  options: countries.map((c) => parseCountry(c).iso2),
  control: {
    type: 'select',
    labels: countries.reduce((acc: Record<string, string>, c) => {
      const { name, iso2 } = parseCountry(c);
      acc[iso2] = `${name} (${iso2})`;
      return acc;
    }, {}),
  },
};

export const Default = Template.bind({});
Default.argTypes = {
  initialCountry: initialCountryArgType,
};

Default.args = {
  disabled: false,
  hideDropdown: false,
  initialCountry: 'us',
  placeholder: 'Phone number',
  defaultMask: '............',
  insertSpaceAfterDialCode: true,
  disableCountryGuess: false,
  disableDialCodePrefill: false,
  forceDialCode: false,
  disableDialCodeAndPrefix: false,
  showDisabledDialCodeAndPrefix: false,
};

export const ForcedDialCode = Template.bind({});
ForcedDialCode.argTypes = {
  initialCountry: initialCountryArgType,
};

ForcedDialCode.args = {
  initialCountry: 'ua',
  forceDialCode: true,
};

export const DisabledPrefill = Template.bind({});
DisabledPrefill.argTypes = {
  initialCountry: initialCountryArgType,
};

DisabledPrefill.args = {
  initialCountry: 'pl',
  disableDialCodePrefill: true,
  placeholder: 'Phone number',
};

export const DisabledCountryGuess = Template.bind({});
DisabledCountryGuess.argTypes = {
  initialCountry: initialCountryArgType,
};

DisabledCountryGuess.args = {
  initialCountry: 'gb',
  disableCountryGuess: true,
};

export const WithoutDropdown = Template.bind({});
WithoutDropdown.argTypes = {
  initialCountry: initialCountryArgType,
};

WithoutDropdown.args = {
  initialCountry: 'ee',
  disableCountryGuess: true,
  hideDropdown: true,
  forceDialCode: true,
};

export const WithCodePreview = Template.bind({});
WithCodePreview.argTypes = {
  initialCountry: initialCountryArgType,
};

WithCodePreview.args = {
  initialCountry: 'fi',
  disableDialCodeAndPrefix: true,
  showDisabledDialCodeAndPrefix: true,
};
