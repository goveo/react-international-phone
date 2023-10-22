import React, { useState } from 'react';

import { PhoneInput, PhoneInputProps } from '../../../index';
import { PhoneInputStory } from '../PhoneInput.stories';

const Story = (props: PhoneInputProps) => {
  const [phone, setPhone] = useState('');

  const setRandomNumber = () => {
    setPhone(`+${Math.floor(Math.random() * 1e15)}`);
  };

  return (
    <div>
      <p>Phone: {phone}</p>
      <button onClick={setRandomNumber}>Set random number</button>
      <PhoneInput value={phone} onChange={setPhone} {...props} />
    </div>
  );
};

export const ControlledMode: PhoneInputStory = {
  name: 'Controlled Mode',
  render: (args) => <Story {...args} />,
  args: {
    defaultCountry: 'fr',
    placeholder: 'Phone number',
  },
};
