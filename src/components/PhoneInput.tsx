import React from "react";

import { usePhone, UsePhoneConfig } from "../hooks/usePhone";

interface PhoneInputProps extends UsePhoneConfig {
  onChange?: (phone: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = () => {
  const { phone, updatePhone } = usePhone("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const inputValue = e.target.value;
    updatePhone(inputValue);
  };

  return <input onChange={handleChange} value={phone} type="tel" />;
};
