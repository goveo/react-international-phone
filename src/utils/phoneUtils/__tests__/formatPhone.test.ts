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

  test('should handle not full phones', () => {
    expect(formatPhone('38099', defaultConfig)).toBe('+380 (99) ');
    expect(formatPhone('3809', defaultConfig)).toBe('+380 (9');
    expect(formatPhone('380', defaultConfig)).toBe('+380 ');
    expect(formatPhone('38', defaultConfig)).toBe('+38');
    expect(formatPhone('3', defaultConfig)).toBe('+3');
  });

  test('should handle empty of wrong value', () => {
    expect(formatPhone('', defaultConfig)).toBe('');
    expect(formatPhone('+', defaultConfig)).toBe('+');
    expect(formatPhone('-', defaultConfig)).toBe('+');
    expect(formatPhone('test', defaultConfig)).toBe('+');
  });

  test('should apply mask if provided phone of another country', () => {
    expect(formatPhone('+1 (234) 567-8900', defaultConfig)).toBe(
      '+123 (45) 678 90 0',
    );
    expect(formatPhone('+389 (123)', defaultConfig)).toBe('+389 (12) 3');
    expect(formatPhone('+123', defaultConfig)).toBe('+123 (');
    expect(formatPhone('+12', defaultConfig)).toBe('+12');
    expect(formatPhone('+1', defaultConfig)).toBe('+1');
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

  test('should trim non digits chars from end of result if trimNonDigitsEnd is true', () => {
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
    ).toBe('+380 ');

    expect(
      formatPhone('380', {
        ...defaultConfig,
        trimNonDigitsEnd: true,
      }),
    ).toBe('+380');
  });

  test('should insert dialCode in the result value if forceDialCode is true', () => {
    const config = {
      ...defaultConfig,
      dialCode: '499',
      mask: '(...) ... ... ...',
      forceDialCode: true,
    };
    expect(formatPhone('380', config)).toBe('+499 ');
    expect(formatPhone('4999', config)).toBe('+499 (9');
    expect(formatPhone('499', config)).toBe('+499 ');
    expect(formatPhone('49', config)).toBe('+499 ');
    expect(formatPhone('4', config)).toBe('+499 ');
    expect(formatPhone('', config)).toBe('+499 ');
  });

  test('should hide dial code if disableDialCodeAndPrefix is true', () => {
    const config = {
      ...defaultConfig,
      dialCode: '499',
      mask: '(...) ... ... ...',
      disableDialCodeAndPrefix: true,
    };
    expect(formatPhone('+499380', config)).toBe('(380) ');
    expect(formatPhone('+499', config)).toBe('');

    expect(
      formatPhone('+380 (99) 111 22 33', {
        ...defaultConfig,
        dialCode: '380',
        disableDialCodeAndPrefix: true,
      }),
    ).toBe('(99) 111 22 33');

    expect(
      formatPhone('380', {
        ...defaultConfig,
        dialCode: '380',
        disableDialCodeAndPrefix: true,
      }),
    ).toBe('');

    expect(
      formatPhone('38', {
        ...defaultConfig,
        dialCode: '380',
        disableDialCodeAndPrefix: true,
      }),
    ).toBe('');
  });
});
