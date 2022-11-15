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
  if (!phone || !dialCode) {
    return phone;
  }

  let result = phone;

  if (result.startsWith(prefix)) {
    result = result.replace(prefix, '');
  }

  if (!result.startsWith(dialCode)) {
    // passed value with wrong dial code
    return phone;
  }

  result = result.replace(dialCode, '');

  if (result.startsWith(charAfterDialCode)) {
    result = result.replace(charAfterDialCode, '');
  }

  return result;
};
