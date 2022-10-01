interface ApplyMaskArgs {
  value: string;
  mask: string;
  maskSymbol: string;
  offset?: number;
  insertSpaceAfterOffset?: boolean;
}

export const applyMask = ({
  value,
  mask,
  maskSymbol,
  offset = 0,
  insertSpaceAfterOffset = true,
}: ApplyMaskArgs): string => {
  const savedValuePart = value.slice(0, offset);
  const valueToMask = value.slice(offset);

  let result = savedValuePart;

  if (offset > 0 && insertSpaceAfterOffset) {
    result += " ";
  }

  let charsPlaced = 0;

  mask.split("").forEach((maskChar) => {
    if (charsPlaced >= valueToMask.length) return;
    if (maskChar === maskSymbol) {
      result += valueToMask[charsPlaced];
      charsPlaced += 1;
    } else {
      result += maskChar;
    }
  });
  return result;
};
