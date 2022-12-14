import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { PhoneInput } from '../components/PhoneInput/PhoneInput';
import { defaultCountries } from '../data/countryData';
import { CountryIso2 } from '../types';
import { parseCountry } from '../utils';

export default {
  title: 'PhoneInput',
  component: PhoneInput,
} as ComponentMeta<typeof PhoneInput>;

const Template: ComponentStory<typeof PhoneInput> = (args) => (
  <PhoneInput {...args} />
);

const initialCountryArgType = {
  options: defaultCountries.map((c) => parseCountry(c).iso2),
  control: {
    type: 'select',
    labels: defaultCountries.reduce((acc: Record<string, string>, c) => {
      const { name, iso2 } = parseCountry(c);
      acc[iso2] = `${name} (${iso2})`;
      return acc;
    }, {}),
  },
};

const argTypes = {
  initialCountry: initialCountryArgType,
};

export const Default = Template.bind({});
Default.argTypes = argTypes;

Default.args = {
  disabled: false,
  hideDropdown: false,
  initialCountry: 'us',
  placeholder: 'Phone number',
  defaultMask: '............',
  hideSpaceAfterDialCode: false,
  disableCountryGuess: false,
  disableDialCodePrefill: false,
  forceDialCode: false,
  disableDialCodeAndPrefix: false,
  showDisabledDialCodeAndPrefix: false,
  style: {},
  inputStyle: {},
  countrySelectorStyleProps: {},
  dialCodePreviewStyleProps: {},
};

export const WithInitialValue = Template.bind({});
WithInitialValue.argTypes = argTypes;

WithInitialValue.args = {
  value: '+380999999999',
  initialCountry: 'ua',
};

export const ForcedDialCode = Template.bind({});
ForcedDialCode.argTypes = argTypes;

ForcedDialCode.args = {
  initialCountry: 'pl',
  forceDialCode: true,
};

export const DisabledPrefill = Template.bind({});
DisabledPrefill.argTypes = argTypes;

DisabledPrefill.args = {
  initialCountry: 'cz',
  disableDialCodePrefill: true,
  placeholder: 'Phone number',
};

export const DisabledCountryGuess = Template.bind({});
DisabledCountryGuess.argTypes = argTypes;

DisabledCountryGuess.args = {
  initialCountry: 'gb',
  disableCountryGuess: true,
};

export const WithoutDropdown = Template.bind({});
WithoutDropdown.argTypes = argTypes;

WithoutDropdown.args = {
  initialCountry: 'ee',
  disableCountryGuess: true,
  hideDropdown: true,
  forceDialCode: true,
};

export const WithCodePreview = Template.bind({});
WithCodePreview.argTypes = argTypes;

WithCodePreview.args = {
  initialCountry: 'lv',
  disableDialCodeAndPrefix: true,
  showDisabledDialCodeAndPrefix: true,
};

export const CustomStyles = Template.bind({});
CustomStyles.argTypes = argTypes;

CustomStyles.args = {
  initialCountry: 'ca',
  style: {
    '--react-international-phone-border-radius': 0,
    '--react-international-phone-border-color': 'gray',
    '--react-international-phone-background-color': '#282c34',
    '--react-international-phone-text-color': 'white',
    '--react-international-phone-selected-dropdown-item-background-color':
      'black',
    '--react-international-phone-country-selector-background-color-hover':
      'black',
  } as React.CSSProperties,
};

export const OnlyEuropeCountries = Template.bind({});
OnlyEuropeCountries.argTypes = argTypes;

OnlyEuropeCountries.args = {
  initialCountry: 'fi',
  countries: defaultCountries.filter((c) =>
    parseCountry(c).regions.includes('europe'),
  ),
};

export const OnlyBalticCountries = Template.bind({});
OnlyBalticCountries.argTypes = argTypes;

const balticCountries: CountryIso2[] = ['lt', 'lv', 'ee'];

OnlyBalticCountries.args = {
  initialCountry: 'lt',
  countries: defaultCountries.filter((c) => {
    return balticCountries.includes(parseCountry(c).iso2);
  }),
};
