import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';

import { PhoneInput } from '../components/PhoneInput/PhoneInput';
import { defaultCountries } from '../data/countryData';
import { CountryIso2 } from '../types';
import { buildCountryData, parseCountry } from '../utils';

export default {
  title: 'PhoneInput',
  component: PhoneInput,
} as ComponentMeta<typeof PhoneInput>;

const Template: ComponentStory<typeof PhoneInput> = (args) => (
  <PhoneInput {...args} />
);

const defaultCountryArgType = {
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
  defaultCountry: defaultCountryArgType,
};

export const Default = Template.bind({});
Default.argTypes = argTypes;

Default.args = {
  disabled: false,
  hideDropdown: false,
  defaultCountry: 'us',
  placeholder: 'Phone number',
  defaultMask: '............',
  charAfterDialCode: ' ',
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
  defaultCountry: 'ua',
};

export const ForcedDialCode = Template.bind({});
ForcedDialCode.argTypes = argTypes;

ForcedDialCode.args = {
  defaultCountry: 'pl',
  forceDialCode: true,
};

export const DisabledPrefill = Template.bind({});
DisabledPrefill.argTypes = argTypes;

DisabledPrefill.args = {
  defaultCountry: 'cz',
  disableDialCodePrefill: true,
  placeholder: 'Phone number',
};

export const DisabledCountryGuess = Template.bind({});
DisabledCountryGuess.argTypes = argTypes;

DisabledCountryGuess.args = {
  defaultCountry: 'gb',
  disableCountryGuess: true,
};

export const WithoutDropdown = Template.bind({});
WithoutDropdown.argTypes = argTypes;

WithoutDropdown.args = {
  defaultCountry: 'ee',
  disableCountryGuess: true,
  hideDropdown: true,
  forceDialCode: true,
};

export const WithHiddenDialCode = Template.bind({});
WithHiddenDialCode.argTypes = argTypes;

WithHiddenDialCode.args = {
  defaultCountry: 'se',
  disableDialCodeAndPrefix: true,
};

export const WithCodePreview = Template.bind({});
WithCodePreview.argTypes = argTypes;

WithCodePreview.args = {
  defaultCountry: 'lv',
  disableDialCodeAndPrefix: true,
  showDisabledDialCodeAndPrefix: true,
};

export const CustomStyles = Template.bind({});
CustomStyles.argTypes = argTypes;

CustomStyles.args = {
  defaultCountry: 'ca',
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
  defaultCountry: 'fi',
  countries: defaultCountries.filter((c) =>
    parseCountry(c).regions.includes('europe'),
  ),
};

export const OnlyBalticCountries = Template.bind({});
OnlyBalticCountries.argTypes = argTypes;

const balticCountries: CountryIso2[] = ['lt', 'lv', 'ee'];

OnlyBalticCountries.args = {
  defaultCountry: 'lt',
  countries: defaultCountries.filter((c) => {
    return balticCountries.includes(parseCountry(c).iso2);
  }),
};

export const WithAutofocus = Template.bind({});
WithAutofocus.argTypes = argTypes;

WithAutofocus.args = {
  defaultCountry: 'es',
  inputProps: {
    autoFocus: true,
  },
};

export const E164Format = Template.bind({});
E164Format.storyName = 'E164 Format';
E164Format.argTypes = argTypes;

const e164Countries = defaultCountries.map((c) => {
  const country = parseCountry(c);
  return buildCountryData({
    ...country,
    format: country.format?.replace(/[^\\.]*/g, ''), // remove all except dots
  });
});

E164Format.args = {
  defaultCountry: 'pt',
  charAfterDialCode: '',
  countries: e164Countries,
  placeholder: 'Phone number',
};
