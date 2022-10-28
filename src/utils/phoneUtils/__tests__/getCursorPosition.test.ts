import { getCursorPosition } from '../getCursorPosition';

describe('getCursorPosition', () => {
  test('should handle empty value', () => {
    expect(
      getCursorPosition({
        phoneBeforeInput: '',
        phoneAfterInput: '1',
        phoneAfterFormatted: '+1 ',
        cursorPositionAfterInput: 1,
      }),
    ).toBe(3);
  });

  test('should handle set in the middle', () => {
    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-',
        phoneAfterInput: '+1 (111) 9111-',
        phoneAfterFormatted: '+1 (111) 911-1',
        cursorPositionAfterInput: 10,
      }),
    ).toBe(10);

    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-1111',
        phoneAfterInput: '+1 (119991) 111-1111',
        phoneAfterFormatted: '+1 (119) 991-1111',
        cursorPositionAfterInput: 9,
      }),
    ).toBe(11);
  });

  test('should handle removal', () => {
    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-1111',
        phoneAfterInput: '+1 (11) 111-1111',
        phoneAfterFormatted: '+1 (111) 111-111',
        cursorPositionAfterInput: 6,
      }),
    ).toBe(6);

    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (234) 567-8901',
        phoneAfterInput: '+1 (24) 567-8901',
        phoneAfterFormatted: '+1 (245) 678-901',
        cursorPositionAfterInput: 5,
      }),
    ).toBe(5);

    // mimic forceDialCode behavior
    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (234) 567-8901',
        phoneAfterInput: '',
        phoneAfterFormatted: '+1',
        cursorPositionAfterInput: 0,
      }),
    ).toBe(2);

    expect(
      getCursorPosition({
        phoneBeforeInput: '+380',
        phoneAfterInput: '+38',
        phoneAfterFormatted: '+380',
        cursorPositionAfterInput: 3,
        leftOffset: 4,
      }),
    ).toBe(4);
  });

  test('should handle change in full phone', () => {
    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-1111',
        phoneAfterInput: '+1 (9111) 111-1111',
        phoneAfterFormatted: '+1 (911) 111-1111',
        cursorPositionAfterInput: 5,
      }),
    ).toBe(5);
  });

  test('should handle selection removal', () => {
    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-',
        phoneAfterInput: '1',
        phoneAfterFormatted: '+1 ',
        cursorPositionAfterInput: 1,
      }),
    ).toBe(3);
  });

  test('should handle input before mask char', () => {
    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-111',
        phoneAfterInput: '+1 9(111) 111-111',
        phoneAfterFormatted: '+1 (911) 111-1111',
        cursorPositionAfterInput: 5,
      }),
    ).toBe(6);

    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-111',
        phoneAfterInput: '+19 (111) 111-111',
        phoneAfterFormatted: '+1 (911) 111-1111',
        cursorPositionAfterInput: 3,
      }),
    ).toBe(5);

    expect(
      getCursorPosition({
        phoneBeforeInput: '+1 (111) 111-111',
        phoneAfterInput: '+91 (111) 111-111',
        phoneAfterFormatted: '+9 (111) 111-1111',
        cursorPositionAfterInput: 2,
      }),
    ).toBe(4);
  });
});
