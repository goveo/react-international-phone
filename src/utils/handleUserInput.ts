import { ParsedCountry } from '../types';
import { isNumeric, removeNonDigits } from './common';
import { handlePhoneChange, PhoneFormattingConfig } from './handlePhoneChange';
import { getCursorPosition, toE164 } from './phoneUtils';

const getDeletionType = (inputType?: string) => {
  const isDeletion = inputType?.toLocaleLowerCase().includes('delete') ?? false;
  if (!isDeletion) return undefined;

  return inputType?.toLocaleLowerCase().includes('forward')
    ? 'forward'
    : 'backward';
};

interface HandleUserInputOptions extends PhoneFormattingConfig {
  country: ParsedCountry;
  insertDialCodeOnEmpty: boolean;
  phoneBeforeInput: string;
}

export const handleUserInput = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  {
    country,
    insertDialCodeOnEmpty,
    phoneBeforeInput,

    prefix,
    charAfterDialCode,
    forceDialCode,
    disableDialCodeAndPrefix,
    countryGuessingEnabled,
    defaultMask,
    countries,
  }: HandleUserInputOptions,
): {
  phone: string;
  e164Phone: string;
  cursorPosition: number;
  country: ParsedCountry;
} => {
  // Didn't find out how to properly type it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const nativeEvent: any = e.nativeEvent;

  // Possible input types:
  // https://rawgit.com/w3c/input-events/v1/index.html#interface-InputEvent-Attributes
  const inputType: string | undefined = nativeEvent.inputType;

  const deletion = getDeletionType(inputType);

  const isInserted = !!inputType?.startsWith('insertFrom');
  const isTyped = inputType === 'insertText';

  const nativeEventData: string | null | undefined = nativeEvent?.data;
  // Last char that user typed on a keyboard
  const lastTypedChar = nativeEventData || undefined;

  const userInput = e.target.value;
  const cursorPositionAfterInput = e.target.selectionStart ?? 0;

  // ignore user input if typed non-digit character
  if (
    isTyped &&
    !isNumeric(lastTypedChar) &&
    // allow type prefix when input value is empty
    userInput !== prefix
  ) {
    return {
      phone: phoneBeforeInput,
      e164Phone: toE164({
        phone: disableDialCodeAndPrefix
          ? `${country.dialCode}${phoneBeforeInput}`
          : phoneBeforeInput,
        prefix,
      }),
      cursorPosition: cursorPositionAfterInput - (lastTypedChar?.length ?? 0),
      country,
    };
  }

  // forceDialCode: ignore dial code change (only if prefixed phone was not inserted)
  if (
    forceDialCode &&
    // dial code has been changed
    !userInput.startsWith(`${prefix}${country.dialCode}`) &&
    // was not inserted with ctrl+v
    !isInserted
  ) {
    return {
      phone: userInput
        ? phoneBeforeInput
        : `${prefix}${country.dialCode}${charAfterDialCode}`,
      e164Phone: `${prefix}${removeNonDigits(phoneBeforeInput)}`,
      cursorPosition:
        prefix.length + country.dialCode.length + charAfterDialCode.length, // set cursor position after dial code
      country,
    };
  }

  const {
    phone: newPhone,
    e164Phone: newE164Phone,
    country: newCountry,
  } = handlePhoneChange({
    value: userInput,
    country,

    trimNonDigitsEnd: deletion === 'backward', // trim values if user deleting chars (delete mask's whitespace and brackets)
    insertDialCodeOnEmpty,
    countryGuessingEnabled,

    countries,
    prefix,
    charAfterDialCode,
    forceDialCode,
    disableDialCodeAndPrefix,
    defaultMask,
  });

  const newCursorPosition = getCursorPosition({
    cursorPositionAfterInput,
    phoneBeforeInput,
    phoneAfterInput: userInput,
    phoneAfterFormatted: newPhone,
    leftOffset: forceDialCode
      ? prefix.length + country.dialCode.length + charAfterDialCode.length
      : 0,
    deletion,
  });

  return {
    phone: newPhone,
    e164Phone: newE164Phone,
    cursorPosition: newCursorPosition,
    country: newCountry,
  };
};
