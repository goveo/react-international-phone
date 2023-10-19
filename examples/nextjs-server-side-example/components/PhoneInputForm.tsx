'use client';

import React, { useState } from 'react';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';

export const PhoneInputForm: React.FC = () => {
  const [phone, setPhone] = useState<string>('');

  return (
    <div>
      <p>Phone: {phone}</p>
      <PhoneInput value={phone} onChange={setPhone} />
    </div>
  );
};
