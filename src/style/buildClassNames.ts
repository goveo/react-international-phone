export const classPrefix = 'react-international-phone-';

export const joinClasses = (...classes: Array<string | false | undefined>) => {
  return classes
    .filter((v) => !!v)
    .join(' ')
    .trim();
};

export const classNamesWithPrefix = (
  ...classes: Array<string | false | undefined>
) => {
  return joinClasses(...classes)
    .split(' ')
    .map((className) => `${classPrefix}${className}`)
    .join(' ');
};

interface BuildClassNamesArgs {
  addPrefix: Array<string | false | undefined>;
  rawClassNames: Array<string | false | undefined>;
}

export const buildClassNames = ({
  addPrefix,
  rawClassNames,
}: BuildClassNamesArgs) => {
  return joinClasses(classNamesWithPrefix(...addPrefix), ...rawClassNames);
};
