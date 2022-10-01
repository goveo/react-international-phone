import React, { useState } from "react";
import { guessCountryByPartialNumber, removeNonDigits } from "../utils";

interface PhoneInputProps {
  prefix: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({ prefix = "+" }) => {
  const [value, setValue] = useState("");

  const updateValue = (newValue: string) => {
    const shouldStartWithPrefix = newValue.length > 0;

    if (shouldStartWithPrefix && newValue[0] !== prefix) {
      return setValue(`${prefix}${newValue}`);
    }
    setValue(newValue);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newValue = e.target.value;

    // should pass prefix input
    if (newValue !== prefix) {
      newValue = removeNonDigits(newValue);
    }
    updateValue(newValue);

    const country = guessCountryByPartialNumber(newValue);
    console.log("country:", country);
  };

  return <input onChange={handleChange} value={value} />;
};
