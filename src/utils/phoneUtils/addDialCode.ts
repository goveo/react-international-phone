import { removeDialCode } from './removeDialCode';

interface AddDialCodeProps {
  phone: string;
  dialCode: string;
  prefix?: string;
  charAfterDialCode?: string;
}

export const addDialCode = ({
  phone,
  dialCode,
  prefix = '+',
  charAfterDialCode = ' ',
}: AddDialCodeProps) => {
  // prevent double dial code
  return `${prefix}${dialCode}${charAfterDialCode}${removeDialCode({
    phone,
    dialCode,
    charAfterDialCode,
    prefix,
  })}`;
};
