import React, { useMemo, useState } from "react";
import { applyMask, guessCountryByPartialNumber } from "../utils";
import { removeNonDigits } from "../utils/common/removeNonDigits";

interface PhoneInputProps {
  prefix?: string;
  maskChar?: string;
}

export const PhoneInput: React.FC<PhoneInputProps> = ({
  prefix = "+",
  maskChar = ".",
}) => {
  const [value, setValue] = useState("");

  const selectedCountry = useMemo(() => {
    return guessCountryByPartialNumber(value);
  }, [value]);

  const format = useMemo(() => {
    return selectedCountry?.format;
  }, [selectedCountry?.format]);

  const updateValue = (v: string) => {
    let newValue = v;
    const shouldStartWithPrefix = newValue.length > 0;

    if (shouldStartWithPrefix && newValue[0] !== prefix) {
      newValue = `${prefix}${newValue}`;
    }

    if (selectedCountry && format) {
      newValue = applyMask({
        value: newValue,
        mask: format,
        maskSymbol: maskChar,
        offset: selectedCountry.dialCode.length + prefix.length,
        insertSpaceAfterOffset: true,
      });
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
