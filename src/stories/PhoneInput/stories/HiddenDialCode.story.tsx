import React from 'react';

import { PhoneInput } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

export const HiddenDialCode: PhoneInputStory = {
  name: 'Hidden Dial Code',
  render: (args) => <PhoneInput {...args} />,
  args: {
    defaultCountry: 'se',
    disableDialCodeAndPrefix: true,
  },
};
