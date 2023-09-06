import { ComponentMeta, ComponentStory } from '@storybook/react';
import React, { useState } from 'react';

import { PhoneInput } from '../components/PhoneInput/PhoneInput';
import { defaultCountries } from '../data/countryData';
import { CountryIso2, CustomFlagImage } from '../types';
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

const updateFormat = (format: string) => format?.replace(/[^\\.]*/g, ''); // remove all except dots

const e164Countries = defaultCountries.map((c) => {
  const country = parseCountry(c);

  // pass if format is undefined
  if (!country.format) return buildCountryData(country);

  // handle string format
  if (typeof country.format === 'string') {
    return buildCountryData({
      ...country,
      format: updateFormat(country.format),
    });
  }

  // handle object format
  const format = { ...country.format };
  for (const key in format) {
    format[key] = updateFormat(format[key]); // update every key in object
  }

  return buildCountryData({
    ...country,
    format,
  });
});

E164Format.args = {
  defaultCountry: 'pt',
  charAfterDialCode: '',
  countries: e164Countries,
  placeholder: 'Phone number',
};

export const ControlledMode = () => {
  const [phone, setPhone] = useState('');

  const setRandomNumber = () => {
    setPhone(`+${Math.floor(Math.random() * 1e15)}`);
  };

  return (
    <div>
      <p style={{ color: 'black' }}>Phone: {phone}</p>
      <button onClick={setRandomNumber}>Set random number</button>
      <PhoneInput
        value={phone}
        onChange={setPhone}
        defaultCountry="fr"
        placeholder="Phone number"
      />
    </div>
  );
};

const customFlags: CustomFlagImage[] = [
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

export const CustomFlags = () => {
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
          '--react-international-phone-flag-height': '24px',
        } as React.CSSProperties
      }
      value={phone}
      onChange={setPhone}
      defaultCountry="jp"
      placeholder="Phone number"
    />
  );
};
