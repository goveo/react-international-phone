import { boolean, withKnobs } from '@storybook/addon-knobs';
import React from 'react';

import { PhoneInput as PhoneInputComponent } from '../components/PhoneInput/PhoneInput';

export default {
  title: 'PhoneInput',
  decorators: [withKnobs],
};

export const Base = () => {
  const disableDropdown = boolean('Disable dropdown', false);
  return <PhoneInputComponent disableDropdown={disableDropdown} />;
};
