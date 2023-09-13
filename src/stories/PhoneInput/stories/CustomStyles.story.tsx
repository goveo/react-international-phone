import React from 'react';

import { PhoneInput } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

export const CustomStyles: PhoneInputStory = {
  name: 'Custom Styles',
  render: (args) => <PhoneInput {...args} />,
  args: {
    defaultCountry: 'ca',
    style: {
      '--react-international-phone-border-radius': 0,
      '--react-international-phone-border-color': 'gray',
      '--react-international-phone-background-color': '#282c34',
      '--react-international-phone-text-color': 'white',
      '--react-international-phone-selected-dropdown-item-background-color':
        'black',
      '--react-international-phone-country-selector-background-color-hover':
        'black',
    } as React.CSSProperties,
  },
};
