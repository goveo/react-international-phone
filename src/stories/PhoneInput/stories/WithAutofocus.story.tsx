import React from 'react';

import { PhoneInput } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

export const WithAutofocus: PhoneInputStory = {
  name: 'With Autofocus',
  render: (args) => <PhoneInput {...args} />,
  args: {
    defaultCountry: 'es',
    inputProps: {
      autoFocus: true,
    },
  },
};
