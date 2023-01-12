import React, { useState } from 'react';

import { AntPhone } from './components/AntPhone';
import { ChakraPhone } from './components/ChakraPhone';
import { MuiPhone } from './components/MuiPhone';
import { MuiPhoneWithAdornment } from './components/MuiPhoneWithAdornment';

export default {
  title: 'Using with UI libs',
};

export const MaterialUI = () => {
  const [phone, setPhone] = useState('+1 (123)');
  return <MuiPhone value={phone} onChange={setPhone} />;
};

export const MaterialUIStyle2 = () => {
  const [phone, setPhone] = useState('+1 (123)');
  return <MuiPhoneWithAdornment value={phone} onChange={setPhone} />;
};
MaterialUIStyle2.storyName = 'Material UI (With adornment)';

export const ChakraUI = () => {
  const [phone, setPhone] = useState('+1 (123)');
  return <ChakraPhone value={phone} onChange={setPhone} />;
};

export const AndDesign = () => {
  const [phone, setPhone] = useState('+1 (123)');
  return <AntPhone value={phone} onChange={setPhone} />;
};
