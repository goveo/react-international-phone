import React from 'react';

import { PhoneInput } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

export const ForcedDialCode: PhoneInputStory = {
  name: 'Forced Dial Code',
  render: (args) => <PhoneInput {...args} />,
  args: {
    defaultCountry: 'pl',
    forceDialCode: true,
  },
};
