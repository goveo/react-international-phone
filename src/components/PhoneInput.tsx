import React from "react";

import { usePhone, UsePhoneConfig } from "../hooks/usePhone";

interface PhoneInputProps extends UsePhoneConfig {
  onChange?: (phone: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = () => {
  const { phone, handlePhoneValueChange } = usePhone("");

  return <input onChange={handlePhoneValueChange} value={phone} type="tel" />;
};
