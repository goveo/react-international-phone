export const isNumeric = (str?: string) => {
  if (!str) return false;

  return /^\d+$/.test(str);
};
