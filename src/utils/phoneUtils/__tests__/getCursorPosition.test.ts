import { getCursorPosition } from '../getCursorPosition';

describe('getCursorPosition', () => {
  test('should handle empty value', () => {
    expect(
      getCursorPosition({
        phoneBeforeInput: '',
        phoneAfterInput: '1',
        cursorPositionAfterInput: '1'.length,
        phoneAfterFormatted: '+1 ',
      }),
    ).toBe(3);
  });

  test('should handle set in the end', () => {
    expect(
      getCursorPosition({
        phoneBeforeInput: '+380 (9',
        phoneAfterInput: '+380 (97',
        cursorPositionAfterInput: '+380 (97'.length,
        phoneAfterFormatted: '+380 (97) ',
      }),
    ).toBe('+380 (97) '.length);
  });

  test('should handle set in the middle', () => {
    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-',
        phoneAfterInput: '+1 (111) 9111-',
        cursorPositionAfterInput: '+1 (111) 9'.length,
        phoneAfterFormatted: '+1 (111) 911-1',
      }),
    ).toBe('+1 (111) 9'.length);

    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-1111',
        phoneAfterInput: '+1 (119991) 111-1111',
        cursorPositionAfterInput: '+1 (11999'.length,
        phoneAfterFormatted: '+1 (119) 991-1111',
      }),
    ).toBe('+1 (119) 99'.length);
  });

  test('should handle removal', () => {
    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-1111',
        phoneAfterInput: '+1 (11) 111-1111',
        cursorPositionAfterInput: '+1 (11'.length,
        phoneAfterFormatted: '+1 (111) 111-111',
      }),
    ).toBe('+1 (11'.length);

    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (234) 567-8901',
        phoneAfterInput: '+1 (24) 567-8901',
        cursorPositionAfterInput: '+1 (2'.length,
        phoneAfterFormatted: '+1 (245) 678-901',
      }),
    ).toBe('+1 (2'.length);

    // mimic forceDialCode behavior
    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (234) 567-8901',
        phoneAfterInput: '',
        cursorPositionAfterInput: 0,
        phoneAfterFormatted: '+1',
      }),
    ).toBe('+1'.length);

    expect(
      getCursorPosition({
        phoneBeforeInput: '+380',
        phoneAfterInput: '+38',
        cursorPositionAfterInput: '+38'.length,
        phoneAfterFormatted: '+380',
        leftOffset: '+380'.length,
      }),
    ).toBe('+380'.length);
  });

  test('should handle change in full phone', () => {
    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-1111',
        phoneAfterInput: '+1 (9111) 111-1111',
        cursorPositionAfterInput: '+1 (9'.length,
        phoneAfterFormatted: '+1 (911) 111-1111',
      }),
    ).toBe('+1 (9'.length);
  });

  test('should handle selection removal', () => {
    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-',
        phoneAfterInput: '1',
        cursorPositionAfterInput: '1'.length,
        phoneAfterFormatted: '+1 ',
      }),
    ).toBe('+1 '.length);
  });

  test('should handle input before mask char', () => {
    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-111',
        phoneAfterInput: '+1 9(111) 111-111',
        cursorPositionAfterInput: '+1 9'.length,
        phoneAfterFormatted: '+1 (911) 111-1111',
      }),
    ).toBe('+1 (9'.length);

    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-111',
        phoneAfterInput: '+19 (111) 111-111',
        cursorPositionAfterInput: '+19'.length,
        phoneAfterFormatted: '+1 (911) 111-1111',
      }),
    ).toBe('+1 (9'.length);

    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-111',
        phoneAfterInput: '+91 (111) 111-111',
        cursorPositionAfterInput: '+9'.length,
        phoneAfterFormatted: '+9 (111) 111-1111',
      }),
    ).toBe('+9 ('.length);
  });

  test('should handle prefix removal', () => {
    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-111',
        phoneAfterInput: '1 (111) 111-111',
        cursorPositionAfterInput: 0,
        phoneAfterFormatted: '+1 (111) 111-1111',
      }),
    ).toBe(0);

    expect(
      getCursorPosition({
        phoneBeforeInput: '+380',
        phoneAfterInput: '380',
        cursorPositionAfterInput: 0,
        phoneAfterFormatted: '+380 ',
      }),
    ).toBe(0);
  });
});
