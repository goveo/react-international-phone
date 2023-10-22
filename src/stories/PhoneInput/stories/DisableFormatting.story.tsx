import React from 'react';

import { PhoneInput } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

export const DisableFormatting: PhoneInputStory = {
  name: 'Disable Formatting',
  render: (args) => <PhoneInput {...args} />,
  args: {
    defaultCountry: 'pt',
    placeholder: 'Phone number',
    charAfterDialCode: '',
    disableFormatting: true,
  },
};
