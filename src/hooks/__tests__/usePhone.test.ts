/* eslint-disable @typescript-eslint/no-empty-function */
import { act, renderHook } from '@testing-library/react-hooks/dom';
import * as React from 'react';

import { usePhone } from '../usePhone';

const createChangeEvent = (options: {
  value: string;
  isDeletion?: boolean;
}) => {
  return {
    preventDefault: () => {},
    nativeEvent: { inputType: options.isDeletion ? 'delete' : 'another-type' },
    target: { value: options.value },
  } as unknown as React.ChangeEvent<HTMLInputElement>;
};

describe('usePhone', () => {
  it('Should set initial value', () => {
    const { result: fullPhone } = renderHook(() =>
      usePhone('+1 (444) 444-4444'),
    );
    expect(fullPhone.current.phone).toBe('+1 (444) 444-4444');

    const { result: notFullPhone } = renderHook(() => usePhone('+1 (444)'));
    expect(notFullPhone.current.phone).toBe('+1 (444) ');
  });

  it('Should format phone with handlePhoneValueChange', () => {
    const { result } = renderHook(() => usePhone(''));

    act(() => {
      result.current.handlePhoneValueChange(
        createChangeEvent({ value: '380123456789' }),
      );
    });
    expect(result.current.phone).toBe('+380 (12) 345 67 89');

    act(() => {
      result.current.handlePhoneValueChange(
        createChangeEvent({ value: '111111' }),
      );
    });
    expect(result.current.phone).toBe('+1 (111) 11');

    act(() => {
      result.current.handlePhoneValueChange(
        createChangeEvent({ value: '+1111111' }),
      );
    });
    expect(result.current.phone).toBe('+1 (111) 111-');

    act(() => {
      result.current.handlePhoneValueChange(
        createChangeEvent({ value: '+1111', isDeletion: true }),
      );
    });
    expect(result.current.phone).toBe('+1 (111');

    act(() => {
      result.current.handlePhoneValueChange(createChangeEvent({ value: '' }));
    });
    expect(result.current.phone).toBe('');
  });

  it('Should handle hideSpaceAfterDialCode config prop', () => {
    // with disabled hideSpaceAfterDialCode
    const { result: resultWithSpace } = renderHook(() =>
      usePhone('', { country: 'us', hideSpaceAfterDialCode: false }),
    );
    act(() => {
      resultWithSpace.current.handlePhoneValueChange(
        createChangeEvent({ value: '+1' }),
      );
    });
    expect(resultWithSpace.current.phone).toBe('+1 ');

    act(() => {
      resultWithSpace.current.handlePhoneValueChange(
        createChangeEvent({ value: '+38099' }),
      );
    });
    expect(resultWithSpace.current.phone).toBe('+380 (99) ');

    act(() => {
      resultWithSpace.current.handlePhoneValueChange(
        createChangeEvent({ value: '+380991112233' }),
      );
    });
    expect(resultWithSpace.current.phone).toBe('+380 (99) 111 22 33');

    // with enabled hideSpaceAfterDialCode
    const { result: resultWithoutSpace } = renderHook(() =>
      usePhone('', { country: 'us', hideSpaceAfterDialCode: true }),
    );
    act(() => {
      resultWithoutSpace.current.handlePhoneValueChange(
        createChangeEvent({ value: '+1' }),
      );
    });
    expect(resultWithoutSpace.current.phone).toBe('+1');

    act(() => {
      resultWithoutSpace.current.handlePhoneValueChange(
        createChangeEvent({ value: '+38099' }),
      );
    });
    expect(resultWithoutSpace.current.phone).toBe('+380(99) ');

    act(() => {
      resultWithoutSpace.current.handlePhoneValueChange(
        createChangeEvent({ value: '+380991112233' }),
      );
    });
    expect(resultWithoutSpace.current.phone).toBe('+380(99) 111 22 33');
  });

  it('Should handle disableCountryGuess config prop', () => {
    const { result } = renderHook(() =>
      usePhone('+123', { country: 'us', disableCountryGuess: true }),
    );
    expect(result.current.phone).toBe('+1 (23');

    act(() => {
      result.current.handlePhoneValueChange(
        createChangeEvent({ value: '+987' }),
      );
    });
    expect(result.current.phone).toBe('+9 (87');

    act(() => {
      result.current.handlePhoneValueChange(
        createChangeEvent({ value: '+98765432100' }),
      );
    });
    expect(result.current.phone).toBe('+9 (876) 543-2100');

    act(() => {
      result.current.handlePhoneValueChange(
        createChangeEvent({ value: '+3876543210' }),
      );
    });
    expect(result.current.phone).toBe('+3 (876) 543-210');
  });

  it('Should handle disableDialCodePrefill config prop', () => {
    const { result: resultWithoutPrefill } = renderHook(() =>
      usePhone('', { country: 'us', disableDialCodePrefill: true }),
    );
    expect(resultWithoutPrefill.current.phone).toBe('');
    act(() => {
      resultWithoutPrefill.current.handlePhoneValueChange(
        createChangeEvent({ value: '' }),
      );
    });
    expect(resultWithoutPrefill.current.phone).toBe('');

    const { result: resultWithPrefill } = renderHook(() =>
      usePhone('', { country: 'us', disableDialCodePrefill: false }),
    );
    expect(resultWithPrefill.current.phone).toBe('+1 ');

    act(() => {
      resultWithPrefill.current.handlePhoneValueChange(
        createChangeEvent({ value: '' }),
      );
    });
    expect(resultWithPrefill.current.phone).toBe('');
  });

  it('Should handle forceDialCode config prop', () => {
    const { result } = renderHook(() =>
      usePhone('', { country: 'us', forceDialCode: true }),
    );
    expect(result.current.phone).toBe('+1 ');

    act(() => {
      result.current.handlePhoneValueChange(
        createChangeEvent({ value: '+1234' }),
      );
    });
    expect(result.current.phone).toBe('+1 (234) ');

    act(() => {
      result.current.handlePhoneValueChange(createChangeEvent({ value: '' }));
    });
    expect(result.current.phone).toBe('+1 ');

    act(() => {
      result.current.handlePhoneValueChange(
        createChangeEvent({ value: '+38099' }),
      );
    });
    expect(result.current.phone).toBe('+380 (99) ');

    act(() => {
      result.current.handlePhoneValueChange(
        createChangeEvent({ value: '+38' }),
      );
    });
    expect(result.current.phone).toBe('+380 ');
  });

  it('Should handle disableDialCodeAndPrefix config prop', () => {
    const { result } = renderHook(() =>
      usePhone('+12345', { country: 'us', disableDialCodeAndPrefix: true }),
    );
    expect(result.current.phone).toBe('(123) 45');

    act(() => {
      result.current.handlePhoneValueChange(
        createChangeEvent({ value: '+1 (123) 456-7890' }),
      );
    });
    expect(result.current.phone).toBe('(112) 345-6789');

    act(() => {
      result.current.handlePhoneValueChange(
        createChangeEvent({ value: '+380 (99) 456-7890' }),
      );
    });
    expect(result.current.phone).toBe('(380) 994-5678');
  });

  it('disableDialCodeAndPrefix should ignore disableCountryGuess and forceDialCode', () => {
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
      withForceDialCode.current.handlePhoneValueChange(
        createChangeEvent({ value: '+1 (123) 456-7890' }),
      );
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
      withDisableCountryGuess.current.handlePhoneValueChange(
        createChangeEvent({ value: '+1 (123) 456-7890' }),
      );
    });
    expect(withDisableCountryGuess.current.phone).toBe('(112) 345-6789');
  });
});
