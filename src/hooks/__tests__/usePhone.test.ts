/* eslint-disable @typescript-eslint/no-empty-function */
import { act, renderHook } from '@testing-library/react-hooks/dom';

import { usePhone } from '../usePhone';

describe('usePhone', () => {
  test('Should set initial value', () => {
    const { result: fullPhone } = renderHook(() =>
      usePhone('+1 (444) 444-4444'),
    );
    expect(fullPhone.current.phone).toBe('+1 (444) 444-4444');

    const { result: notFullPhone } = renderHook(() => usePhone('+1 (444)'));
    expect(notFullPhone.current.phone).toBe('+1 (444) ');
  });

  test('Should format phone with handleValueChange', () => {
    const { result } = renderHook(() => usePhone(''));

    act(() => {
      result.current.handleValueChange('380123456789');
    });
    expect(result.current.phone).toBe('+380 (12) 345 67 89');

    act(() => {
      result.current.handleValueChange('111111');
    });
    expect(result.current.phone).toBe('+1 (111) 11');

    act(() => {
      result.current.handleValueChange('+1111111');
    });
    expect(result.current.phone).toBe('+1 (111) 111-');

    act(() => {
      result.current.handleValueChange('+1111');
    });
    expect(result.current.phone).toBe('+1 (111) ');

    act(() => {
      result.current.handleValueChange('');
    });
    expect(result.current.phone).toBe('');
  });

  test('Should handle charAfterDialCode config prop', () => {
    // with space
    const { result: resultWithSpace } = renderHook(() =>
      usePhone('', { country: 'us', charAfterDialCode: ' ' }),
    );
    act(() => {
      resultWithSpace.current.handleValueChange('+1');
    });
    expect(resultWithSpace.current.phone).toBe('+1 ');

    act(() => {
      resultWithSpace.current.handleValueChange('+38099');
    });
    expect(resultWithSpace.current.phone).toBe('+380 (99) ');

    act(() => {
      resultWithSpace.current.handleValueChange('+380991112233');
    });
    expect(resultWithSpace.current.phone).toBe('+380 (99) 111 22 33');

    // without space
    const { result: resultWithoutSpace } = renderHook(() =>
      usePhone('', { country: 'us', charAfterDialCode: '' }),
    );
    act(() => {
      resultWithoutSpace.current.handleValueChange('+1');
    });
    expect(resultWithoutSpace.current.phone).toBe('+1');

    act(() => {
      resultWithoutSpace.current.handleValueChange('+38099');
    });
    expect(resultWithoutSpace.current.phone).toBe('+380(99) ');

    act(() => {
      resultWithoutSpace.current.handleValueChange('+380991112233');
    });
    expect(resultWithoutSpace.current.phone).toBe('+380(99) 111 22 33');
  });

  test('Should handle disableCountryGuess config prop', () => {
    const { result } = renderHook(() =>
      usePhone('+123', { country: 'us', disableCountryGuess: true }),
    );
    expect(result.current.phone).toBe('+1 (23');

    act(() => {
      result.current.handleValueChange('+987');
    });
    expect(result.current.phone).toBe('+9 (87');

    act(() => {
      result.current.handleValueChange('+98765432100');
    });
    expect(result.current.phone).toBe('+9 (876) 543-2100');

    act(() => {
      result.current.handleValueChange('+3876543210');
    });
    expect(result.current.phone).toBe('+3 (876) 543-210');
  });

  test('Should handle disableDialCodePrefill config prop', () => {
    const { result: resultWithoutPrefill } = renderHook(() =>
      usePhone('', { country: 'us', disableDialCodePrefill: true }),
    );
    expect(resultWithoutPrefill.current.phone).toBe('');
    act(() => {
      resultWithoutPrefill.current.handleValueChange('');
    });
    expect(resultWithoutPrefill.current.phone).toBe('');

    const { result: resultWithPrefill } = renderHook(() =>
      usePhone('', { country: 'us', disableDialCodePrefill: false }),
    );
    expect(resultWithPrefill.current.phone).toBe('+1 ');

    act(() => {
      resultWithPrefill.current.handleValueChange('');
    });
    expect(resultWithPrefill.current.phone).toBe('');
  });

  describe('should handle forceDialCode config prop', () => {
    test('should handle default behavior', () => {
      const { result } = renderHook(() =>
        usePhone('', { country: 'us', forceDialCode: true }),
      );
      expect(result.current.phone).toBe('+1 ');

      act(() => {
        result.current.handleValueChange('+1234');
      });
      expect(result.current.phone).toBe('+1 (234) ');

      act(() => {
        result.current.handleValueChange('');
      });
      expect(result.current.phone).toBe('+1 ');

      act(() => {
        result.current.handleValueChange('+38099');
      });
    });

    test('should not allow dial code change', () => {
      const { result } = renderHook(() =>
        usePhone('', { country: 'us', forceDialCode: true }),
      );
      expect(result.current.phone).toBe('+1 ');

      act(() => {
        result.current.handleValueChange('+38099');
      });
      expect(result.current.phone).toBe('+1 ');

      act(() => {
        result.current.handleValueChange('+38');
      });
      expect(result.current.phone).toBe('+1 ');
    });

    test('allow dial code change if a new phone was pasted', () => {
      const { result } = renderHook(() =>
        usePhone('', { country: 'us', forceDialCode: true }),
      );
      expect(result.current.phone).toBe('+1 ');

      // should start with prefix
      act(() => {
        result.current.handleValueChange('38099', {
          inserted: true,
          cursorPosition: '38099'.length,
        });
      });
      expect(result.current.phone).toBe('+1 ');

      act(() => {
        result.current.handleValueChange('++3809711 ', {
          inserted: true,
          cursorPosition: '+'.length,
        });
      });
      expect(result.current.phone).toBe('+1 ');

      act(() => {
        result.current.handleValueChange('+38099', {
          inserted: true,
          cursorPosition: '+38099'.length,
        });
      });
      expect(result.current.phone).toBe('+380 (99) ');
    });
  });

  test('Should handle disableDialCodeAndPrefix config prop', () => {
    const { result } = renderHook(() =>
      usePhone('+12345', { country: 'us', disableDialCodeAndPrefix: true }),
    );
    expect(result.current.phone).toBe('(123) 45');

    act(() => {
      result.current.handleValueChange('+1 (123) 456-7890');
    });
    expect(result.current.phone).toBe('(112) 345-6789');

    act(() => {
      result.current.handleValueChange('+380 (99) 456-7890');
    });
    expect(result.current.phone).toBe('(380) 994-5678');
  });

  test('disableDialCodeAndPrefix should ignore disableCountryGuess and forceDialCode', () => {
    // forceDialCode
    const { result: withForceDialCode } = renderHook(() =>
      usePhone('+12345', {
        country: 'us',
        disableDialCodeAndPrefix: true,
        forceDialCode: true,
      }),
    );
    expect(withForceDialCode.current.phone).toBe('(123) 45');

    act(() => {
      withForceDialCode.current.handleValueChange('+1 (123) 456-7890');
    });
    expect(withForceDialCode.current.phone).toBe('(112) 345-6789');

    // disableCountryGuess
    const { result: withDisableCountryGuess } = renderHook(() =>
      usePhone('+12345', {
        country: 'us',
        disableDialCodeAndPrefix: true,
        disableCountryGuess: true,
      }),
    );
    expect(withDisableCountryGuess.current.phone).toBe('(123) 45');

    act(() => {
      withDisableCountryGuess.current.handleValueChange('+1 (123) 456-7890');
    });
    expect(withDisableCountryGuess.current.phone).toBe('(112) 345-6789');
  });
});
