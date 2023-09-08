import { CountryData, ParsedCountry } from '../types';
import { removeNonDigits } from './common';
import { handlePhoneChange } from './handlePhoneChange';
import { getCursorPosition } from './phoneUtils';

const getDeletionType = (inputType?: string) => {
  const isDeletion = inputType?.toLocaleLowerCase().includes('delete') ?? false;
  if (!isDeletion) return undefined;

  return inputType?.toLocaleLowerCase().includes('forward')
    ? 'forward'
    : 'backward';
};

type DeletionType = 'forward' | 'backward' | undefined;

interface HandleUserInputOptions {
  country: ParsedCountry;
  deletion?: DeletionType;
  inserted?: boolean;
  cursorPosition?: number;

  insertDialCodeOnEmpty: boolean;
  prefix: string;
  forceDialCode: boolean;
  disableDialCodeAndPrefix: boolean;
  phoneBeforeInput: string;
  countryGuessingEnabled: boolean;
  charAfterDialCode: string;
  countries: CountryData[];
  defaultMask: string;
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
) => {
  // Possible input types:
  // https://rawgit.com/w3c/input-events/v1/index.html#interface-InputEvent-Attributes
  // Didn't find out how to properly type it
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const inputType: string | undefined = (e.nativeEvent as any).inputType;

  const deletion = getDeletionType(inputType);

  const isInserted = inputType?.startsWith('insertFrom');

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
      // cursor position was set to 0 before the input
      userInput.length - cursorPositionAfterInput === 0;

    if (!fullPhoneInsert) {
      // Prevent change of dial code and set the cursor to beginning
      // (after formatting it will be set after dial code)
      return {
        phone: phoneBeforeInput,
        cursorPosition: phoneBeforeInput.length,
        country,
      };
    }
  }

  const { phone: phoneValue, countryGuessResult } = handlePhoneChange({
    value: userInput,
    country,

    trimNonDigitsEnd: deletion === 'backward', // trim values if user deleting chars (delete mask's whitespace and brackets)
    insertDialCodeOnEmpty,
    forceDisableCountryGuess:
      forceDialCode &&
      !!deletion &&
      removeNonDigits(userInput).length < country.dialCode.length,

    countryGuessingEnabled,
    countries,
    disableDialCodeAndPrefix,
    prefix,
    defaultMask,
    charAfterDialCode,
    forceDialCode,
  });

  const newCountry =
    countryGuessingEnabled &&
    countryGuessResult?.country &&
    countryGuessResult.country.iso2 !== country.iso2 &&
    countryGuessResult.fullDialCodeMatch
      ? countryGuessResult.country
      : country;

  const newCursorPosition = getCursorPosition({
    cursorPositionAfterInput: cursorPositionAfterInput ?? 0,
    phoneBeforeInput: phoneBeforeInput,
    phoneAfterInput: e.target.value,
    phoneAfterFormatted: phoneValue,
    leftOffset: forceDialCode
      ? prefix.length + country.dialCode.length + charAfterDialCode.length
      : 0,
    deletion,
  });

  return {
    phone: phoneValue,
    cursorPosition: newCursorPosition,
    country: newCountry,
  };
};
