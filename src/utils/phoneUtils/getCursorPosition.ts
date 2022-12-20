const isDigit = (str: string) => {
  return /\d/.test(str);
};

interface GetCursorPositionProps {
  phoneBeforeInput: string;
  phoneAfterInput: string;
  phoneAfterFormatted: string;
  cursorPositionAfterInput: number;
  leftOffset?: number;
}

const getStringsDifference = ({
  phoneBeforeInput,
  phoneAfterInput,
  cursorPositionAfterInput,
}: {
  phoneBeforeInput: string;
  phoneAfterInput: string;
  cursorPositionAfterInput: number;
}) => {
  let differenceStartIndex: number | null = null;
  let differenceEndIndex: number | null = null;

  for (let i = 0; i < cursorPositionAfterInput; i += 1) {
    if (phoneBeforeInput[i] !== phoneAfterInput[i]) {
      differenceStartIndex = i;
      break;
    }
  }

  for (let offset = 0; offset < phoneAfterInput.length; offset += 1) {
    const indexBefore = phoneBeforeInput.length - offset;
    const indexAfter = phoneAfterInput.length - offset;

    if (phoneBeforeInput[indexBefore] !== phoneAfterInput[indexAfter]) {
      differenceEndIndex = indexAfter;
      break;
    }
  }

  return {
    differenceStartIndex,
    differenceEndIndex,
  };
};

export const getCursorPosition = ({
  phoneBeforeInput,
  phoneAfterInput,
  phoneAfterFormatted,
  cursorPositionAfterInput,
  leftOffset = 0,
}: GetCursorPositionProps) => {
  if (cursorPositionAfterInput < leftOffset) {
    return leftOffset;
  }

  if (!phoneBeforeInput) {
    return phoneAfterFormatted.length;
  }

  if (
    cursorPositionAfterInput === 0 &&
    phoneAfterInput.length > 0 &&
    phoneAfterFormatted.length > 0
  ) {
    return 0;
  }

  // Handle whole value removal (select all + replace by new value)
  if (
    phoneAfterInput.length < phoneBeforeInput.length &&
    phoneAfterInput.length === 1
  ) {
    return phoneAfterFormatted.length;
  }

  let isDeletion = false;
  if (phoneAfterInput.length < phoneBeforeInput.length) {
    const { differenceStartIndex } = getStringsDifference({
      phoneBeforeInput,
      phoneAfterInput,
      cursorPositionAfterInput,
    });
    if (differenceStartIndex === null) {
      isDeletion = true;
    }
  }

  let lastInsertedDigitIndex: number | null = null;
  for (let index = cursorPositionAfterInput - 1; index >= 0; index -= 1) {
    if (isDigit(phoneAfterInput[index])) {
      lastInsertedDigitIndex = index;
      break;
    }
  }

  if (lastInsertedDigitIndex === null) {
    if (cursorPositionAfterInput !== 0) {
      return cursorPositionAfterInput;
    }
    return phoneAfterFormatted.length;
  }

  // find "digit index" of new char (only digits count)
  let newCharDigitIndex = 0;
  for (let index = 0; index < lastInsertedDigitIndex; index += 1) {
    if (isDigit(phoneAfterInput[index])) {
      newCharDigitIndex += 1;
    }
  }

  // if deletion -> move cursor to prev char
  if (isDeletion) {
    newCharDigitIndex -= 1;
  }

  // find cursor position by going over digits until we get newCharDigitIndex
  let cursorPosition = 0;
  let digitsBeforeCursor = 0;
  for (let index = 0; index < phoneAfterFormatted.length; index += 1) {
    cursorPosition += 1;

    if (isDigit(phoneAfterFormatted[index])) {
      digitsBeforeCursor += 1;
    }

    if (digitsBeforeCursor === newCharDigitIndex + 1) {
      break;
    }
  }

  // set cursor before digit (jump over spaces and braces)
  while (
    !isDigit(phoneAfterFormatted[cursorPosition]) &&
    cursorPosition < phoneAfterFormatted.length
  ) {
    cursorPosition += 1;
  }

  if (isDeletion) {
    cursorPosition += 1;
  }

  return cursorPosition;
};
