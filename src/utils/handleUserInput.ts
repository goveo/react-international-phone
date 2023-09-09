import { ParsedCountry } from '../types';
import { removeNonDigits } from './common';
import { handlePhoneChange, PhoneFormattingConfig } from './handlePhoneChange';
import { getCursorPosition } from './phoneUtils';

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

  const nativeEventData: string | null | undefined = nativeEvent?.data;
  // Last char that user typed on a keyboard
  const lastTypedChar = nativeEventData || undefined;

  const userInput = e.target.value;
  const cursorPositionAfterInput = e.target.selectionStart ?? 0;

  // handle forceDialCode edge case
  if (
    forceDialCode &&
    !disableDialCodeAndPrefix &&
    // dial code has been changed
    !removeNonDigits(userInput).startsWith(country.dialCode) &&
    // but phone was not removed completely
    !!userInput
  ) {
    // Allow dial code change when selected all (ctrl+a) and inserted new value that starts with prefix
    const fullPhoneInsert =
      isInserted &&
      userInput.startsWith(prefix) &&
      // cursor position was set to 0 before the input (selected all)
      userInput.length - cursorPositionAfterInput === 0;

    if (!fullPhoneInsert) {
      // Prevent change of dial code and set the cursor to beginning
      // (after formatting it will be set after dial code)
      // TODO: set cursor after dial code
      return {
        phone: phoneBeforeInput,
        e164Phone: `${prefix}${removeNonDigits(phoneBeforeInput)}`,
        cursorPosition: phoneBeforeInput.length,
        country,
      };
    }
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
    lastTypedChar,

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
