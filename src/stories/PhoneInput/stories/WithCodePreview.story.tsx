import React from 'react';

import { PhoneInput } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

export const WithCodePreview: PhoneInputStory = {
  name: 'With Code Preview',
  render: (args) => <PhoneInput {...args} />,
  args: {
    defaultCountry: 'lv',
    disableDialCodeAndPrefix: true,
    showDisabledDialCodeAndPrefix: true,
  },
};
