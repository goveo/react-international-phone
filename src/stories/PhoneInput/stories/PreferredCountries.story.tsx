import React from 'react';

import { PhoneInput } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

export const PreferredCountries: PhoneInputStory = {
  name: 'With Preferred Countries',
  render: (args) => <PhoneInput {...args} />,
  args: {
    preferredCountries: ['us', 'gb'],
  },
};
