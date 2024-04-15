import React from 'react';

import { PhoneInput } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

export const WithOrder: PhoneInputStory = {
  name: 'With Order Prop',
  render: (args) => <PhoneInput {...args} />,
  args: {
    defaultCountry: 'br',
    disableDialCodeAndPrefix: true,
    order: ['flag', 'country', 'dial', 'arrow'],
  },
};
