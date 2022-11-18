import { addDialCode } from '../addDialCode';

describe('addDialCode', () => {
  test('should handle empty value', () => {
    expect(
      addDialCode({
        phone: '',
        dialCode: '380',
      }),
    ).toBe('+380 ');
  });

  test('should add dial code', () => {
    expect(
      addDialCode({
        phone: '(234) 56',
        dialCode: '1',
      }),
    ).toBe('+1 (234) 56');

    expect(
      addDialCode({
        phone: '(99) ',
        dialCode: '380',
      }),
    ).toBe('+380 (99) ');

    expect(
      addDialCode({
        phone: '(33) 333',
        dialCode: '33',
      }),
    ).toBe('+33 (33) 333');
  });

  test('should prevent dial code duplicate', () => {
    expect(
      addDialCode({
        phone: '+1 (234) 56',
        dialCode: '1',
      }),
    ).toBe('+1 (234) 56');

    expect(
      addDialCode({
        phone: '+380 (99) ',
        dialCode: '380',
      }),
    ).toBe('+380 (99) ');

    expect(
      addDialCode({
        phone: '+33 (33) 333',
        dialCode: '33',
      }),
    ).toBe('+33 (33) 333');
  });
});
