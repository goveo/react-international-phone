import React, { useState } from "react";

import { removeNonDigits } from "../utils/common/removeNonDigits";

interface PhoneInputProps {
  prefix?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ prefix = "+" }) => {
  const [value, setValue] = useState("");

  const updateValue = (v: string) => {
    let newValue = v;
    const shouldStartWithPrefix = newValue.length > 0;

    if (shouldStartWithPrefix && newValue[0] !== prefix) {
      newValue = `${prefix}${newValue}`;
    }

    setValue(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    let newValue = e.target.value;

    // should pass prefix input
    if (newValue !== prefix) {
      newValue = removeNonDigits(newValue);
    }
    updateValue(newValue);
  };

  return <input onChange={handleChange} value={value} />;
};
