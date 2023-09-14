import React from 'react';

import { PhoneInput } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

export const DisabledPrefill: PhoneInputStory = {
  name: 'Disabled Prefill',
  render: (args) => <PhoneInput {...args} />,
  args: {
    defaultCountry: 'cz',
    disableDialCodePrefill: true,
    placeholder: 'Phone number',
  },
};
