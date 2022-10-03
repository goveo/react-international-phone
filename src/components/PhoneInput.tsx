import React, { useRef } from "react";

import { usePhone, UsePhoneConfig } from "../hooks/usePhone";

interface PhoneInputProps extends UsePhoneConfig {
  onChange?: (phone: string) => void;
}

export const PhoneInput: React.FC<PhoneInputProps> = () => {
  const inputRef = useRef<HTMLInputElement>(null);

  const { phone, handlePhoneValueChange } = usePhone("", {
    inputRef,
    country: "Ukraine",
  });

  return (
    <input
      onChange={handlePhoneValueChange}
      value={phone}
      type="tel"
      ref={inputRef}
    />
  );
};
