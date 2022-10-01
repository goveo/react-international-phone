export const removeNonDigits = (value: string): string => {
  return value.replace(/\D/g, "");
};
