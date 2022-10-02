interface InsertCharArgs {
  value: string;
  position: number;
  char: string;
}

export const insertChar = ({
  value,
  position,
  char,
}: InsertCharArgs): string => {
  if (position > value.length || position < 0) {
    return value;
  }

  const left = value.slice(0, position);
  const right = value.slice(position);

  return `${left}${char}${right}`;
};
