export const classPrefix = 'react-international-phone-';

export const buildClassNames = (
  ...classes: Array<string | false | undefined>
) => {
  return classes
    .filter((v) => !!v)
    .map((className) => `${classPrefix}${className}`)
    .join(' ')
    .trim();
};
