export const applyMask = (
  value: string,
  mask: string,
  maskSymbol: string,
): string => {
  const [result] = mask.split("").reduce(
    (acc: [string, number], maskChar): [string, number] => {
      let [result, valueIndex] = acc;

      if (valueIndex >= value.length) return [result, valueIndex];

      if (maskChar === maskSymbol) {
        result += value[valueIndex];
        valueIndex += 1;
      } else {
        result += maskChar;
      }

      return [result, valueIndex];
    },
    ["", 0],
  );
  return result;
};
