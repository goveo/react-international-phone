import React from 'react';

import { PhoneInput } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

export const WithInitialValue: PhoneInputStory = {
  name: 'With Initial Value',
  render: (args) => <PhoneInput {...args} />,
  args: {
    value: '+380999999999',
    defaultCountry: 'ua',
  },
};
