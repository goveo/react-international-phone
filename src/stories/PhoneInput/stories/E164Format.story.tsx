import React from 'react';

import {
  buildCountryData,
  defaultCountries,
  parseCountry,
  PhoneInput,
} from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

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

export const E164Format: PhoneInputStory = {
  name: 'E.164 Format',
  render: (args) => <PhoneInput {...args} />,
  args: {
    defaultCountry: 'pt',
    charAfterDialCode: '',
    countries: e164Countries,
    placeholder: 'Phone number',
  },
};
