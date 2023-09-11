const isDigit = (str: string) => {
  return /\d/.test(str);
};

interface GetCursorPositionProps {
  phoneBeforeInput: string;
  phoneAfterInput: string;
  phoneAfterFormatted: string;
  cursorPositionAfterInput: number;
  leftOffset?: number;
  deletion?: 'forward' | 'backward' | undefined;
}

export const getCursorPosition = ({
  phoneBeforeInput,
  phoneAfterInput,
  phoneAfterFormatted,
  cursorPositionAfterInput,
  leftOffset = 0,
  deletion,
}: GetCursorPositionProps) => {
  if (cursorPositionAfterInput < leftOffset) {
    return leftOffset;
  }

  if (!phoneBeforeInput) {
    return phoneAfterFormatted.length;
  }

  let afterInputPointIndex: number | null = null;

  // iterate from right to left and get first digit char
  for (let index = cursorPositionAfterInput - 1; index >= 0; index -= 1) {
    if (isDigit(phoneAfterInput[index])) {
      afterInputPointIndex = index;
      break;
    }
  }

  if (afterInputPointIndex === null) {
    for (let index = 0; index < phoneAfterInput.length; index += 1) {
      if (isDigit(phoneAfterFormatted[index])) {
        return index;
      }
    }

    return phoneAfterInput.length;
  }

  // find "digit index" of new char (only digits count)
  let digitIndex = 0;
  for (let index = 0; index < afterInputPointIndex; index += 1) {
    if (isDigit(phoneAfterInput[index])) {
      digitIndex += 1;
    }
  }

  // find cursor position by going over digits until we get digitIndex
  let cursorPosition = 0;
  let digitsCounter = 0;
  for (let index = 0; index < phoneAfterFormatted.length; index += 1) {
    cursorPosition += 1;

    if (isDigit(phoneAfterFormatted[index])) {
      digitsCounter += 1;
    }

    if (digitsCounter >= digitIndex + 1) {
      break;
    }
  }

  // set cursor before next digit (jump over mask chars on the right side)
  if (deletion !== 'backward') {
    while (
      !isDigit(phoneAfterFormatted[cursorPosition]) &&
      cursorPosition < phoneAfterFormatted.length
    ) {
      cursorPosition += 1;
    }
  }

  return cursorPosition;
};
