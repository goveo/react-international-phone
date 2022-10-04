import { storiesOf } from '@storybook/react';
import React from 'react';

import { PhoneInput } from '../components/PhoneInput/PhoneInput';

const stories = storiesOf('App Test', module);

stories.add('App', () => {
  return <PhoneInput />;
});
