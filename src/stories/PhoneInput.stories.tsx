import React from 'react';

import { storiesOf } from '@storybook/react';
import { PhoneInput } from '../components/PhoneInput';

const stories = storiesOf('App Test', module);

stories.add('App', () => {
  return <PhoneInput />;
});
