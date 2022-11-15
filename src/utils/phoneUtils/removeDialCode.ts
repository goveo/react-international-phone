interface RemoveDialCodeProps {
  phone: string;
  dialCode: string;
  prefix?: string;
  charAfterDialCode?: string;
}

export const removeDialCode = ({
  phone,
  dialCode,
  prefix = '+',
  charAfterDialCode = ' ',
}: RemoveDialCodeProps) => {
  const prefixSubstring = `${prefix}${dialCode}${charAfterDialCode}`;

  if (!phone.startsWith(prefixSubstring)) {
    return phone;
  }

  return phone.replace(prefixSubstring, '');
};
