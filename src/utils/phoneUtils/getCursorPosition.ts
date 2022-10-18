const isDigit = (str: string) => {
  return /\d/.test(str);
};

interface GetCursorPositionProps {
  phoneBeforeInput: string;
  phoneAfterInput: string;
  phoneAfterFormatted: string;
  cursorPositionAfterInput: number;
}

export const getCursorPosition = ({
  phoneBeforeInput,
  phoneAfterInput,
  phoneAfterFormatted,
  cursorPositionAfterInput,
}: GetCursorPositionProps) => {
  if (!phoneBeforeInput) {
    return phoneAfterFormatted.length;
  }

  // Handle whole value removal (select all + replace by new value)
  if (
    phoneAfterInput.length < phoneBeforeInput.length &&
    phoneAfterInput.length === 1
  ) {
    return phoneAfterFormatted.length;
  }

  // find inserted char index in phoneAfter value
  let phoneAfterNewCharIndex: number | null = null;
  for (let index = cursorPositionAfterInput - 1; index > 0; index -= 1) {
    if (phoneAfterInput[index] !== phoneBeforeInput[index]) {
      phoneAfterNewCharIndex = index;
      break;
    }
  }

  if (phoneAfterNewCharIndex === null) {
    return cursorPositionAfterInput;
  }

  // find "digit index" of new char (only digits count)
  let newCharDigitIndex = 0;
  for (let index = 0; index < phoneAfterNewCharIndex; index += 1) {
    if (isDigit(phoneAfterInput[index])) {
      newCharDigitIndex += 1;
    }
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

  return cursorPosition;
};
