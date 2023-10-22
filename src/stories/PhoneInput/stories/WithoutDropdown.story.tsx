import React from 'react';

import { PhoneInput } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

export const WithoutDropdown: PhoneInputStory = {
  name: 'Without Dropdown',
  render: (args) => <PhoneInput {...args} />,
  args: {
    defaultCountry: 'ee',
    disableCountryGuess: true,
    hideDropdown: true,
    forceDialCode: true,
  },
};
