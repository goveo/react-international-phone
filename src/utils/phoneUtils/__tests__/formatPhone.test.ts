import { formatPhone, FormatPhoneConfig } from '../formatPhone';

const defaultConfig: FormatPhoneConfig = {
  prefix: '+',
  mask: '(..) ... .. ..',
  maskChar: '.',
  dialCode: '380',
  charAfterDialCode: ' ',
  trimNonDigitsEnd: false,
};

describe('formatPhone', () => {
  test('should apply mask', () => {
    const result = '+380 (00) 111 22 33';
    expect(formatPhone('+380 (00) 111 22 33', defaultConfig)).toBe(result);
    expect(formatPhone('+380001112233', defaultConfig)).toBe(result);
    expect(formatPhone('+380-00-111-2233', defaultConfig)).toBe(result);
    expect(formatPhone('3 8 0 0 0 1 1 1 2 2 3 3', defaultConfig)).toBe(result);
  });

  test('should trim provided value by mask', () => {
    expect(formatPhone('+380123456789012345678', defaultConfig)).toBe(
      '+380 (12) 345 67 89',
    );
  });

  test('should support different prefixes', () => {
    expect(formatPhone('+380123456789', { ...defaultConfig, prefix: '' })).toBe(
      '380 (12) 345 67 89',
    );

    expect(
      formatPhone('+380123456789', { ...defaultConfig, prefix: '-' }),
    ).toBe('-380 (12) 345 67 89');

    expect(
      formatPhone('+380123456789', {
        ...defaultConfig,
        prefix: 'test-prefix-00',
      }),
    ).toBe('test-prefix-00380 (12) 345 67 89');
  });

  test('should support different charAfterDialCode', () => {
    expect(
      formatPhone('+380123456789', { ...defaultConfig, charAfterDialCode: '' }),
    ).toBe('+380(12) 345 67 89');

    expect(
      formatPhone('+380123456789', {
        ...defaultConfig,
        charAfterDialCode: '-',
      }),
    ).toBe('+380-(12) 345 67 89');
  });

  test('should trim non digits chars from end of result', () => {
    expect(
      formatPhone('38012', {
        ...defaultConfig,
        trimNonDigitsEnd: false,
      }),
    ).toBe('+380 (12) ');

    expect(
      formatPhone('38012', {
        ...defaultConfig,
        trimNonDigitsEnd: true,
      }),
    ).toBe('+380 (12');

    expect(
      formatPhone('380', {
        ...defaultConfig,
        trimNonDigitsEnd: false,
      }),
    ).toBe('+380 (');

    expect(
      formatPhone('380', {
        ...defaultConfig,
        trimNonDigitsEnd: true,
      }),
    ).toBe('+380');
  });

  test('should not format empty value', () => {
    expect(formatPhone('', defaultConfig)).toBe('');
  });

  test('should insert dialCode in the result value if forceDialCode is true', () => {
    const config = {
      ...defaultConfig,
      dialCode: '499',
      mask: '(...) ... ... ...',
      forceDialCode: true,
    };
    expect(formatPhone('380', config)).toBe('+499 (380) ');
    expect(formatPhone('499', config)).toBe('+499 (');
  });

  test('should hide dial code if disableDialCodeAndPrefix is true', () => {
    const config = {
      ...defaultConfig,
      dialCode: '499',
      mask: '(...) ... ... ...',
      disableDialCodeAndPrefix: true,
    };
    expect(formatPhone('380', config)).toBe('(380) ');
    expect(formatPhone('499', config)).toBe('(499) ');

    expect(
      formatPhone('+380 (99) 111 22 33', {
        ...defaultConfig,
        dialCode: '380',
        disableDialCodeAndPrefix: true,
      }),
    ).toBe('(38) 099 11 12');
  });
});
