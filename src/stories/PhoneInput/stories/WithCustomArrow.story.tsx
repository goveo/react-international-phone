import React from 'react';

import { PhoneInput } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

export const WithCustomArrow: PhoneInputStory = {
  name: 'With Custom Arrow Prop',
  render: (args) => <PhoneInput {...args} />,
  args: {
    defaultCountry: 'br',
    disableDialCodeAndPrefix: true,
    order: ['country', 'flag', 'arrow', 'dial'],
    customArrow: <div>123</div>,
  },
};
