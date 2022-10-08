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
    const initialValue = '+1 (444) 444-4444';
    const { result } = renderHook(() => usePhone(initialValue));
    expect(result.current.phone).toBe(initialValue);
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

  it('Should set prefix dialCode if country provided', () => {
    const { result } = renderHook(() => usePhone('', { country: 'us' }));
    expect(result.current.phone).toBe('+1 ');
  });
});
