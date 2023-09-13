import React from 'react';

import { PhoneInput } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

export const DisabledCountryGuess: PhoneInputStory = {
  name: 'Disabled Country Guess',
  render: (args) => <PhoneInput {...args} />,
  args: {
    defaultCountry: 'gb',
    disableCountryGuess: true,
  },
};
