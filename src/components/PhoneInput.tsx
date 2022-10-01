import React, { InputHTMLAttributes } from "react";

type PhoneInputProps = InputHTMLAttributes<HTMLInputElement>;

export const PhoneInput: React.FC<PhoneInputProps> = (props) => {
  return <input {...props} />;
};
