import { act, renderHook } from '@testing-library/react-hooks/dom';

import { useTimer } from '../useTimer';

describe('useTimer', () => {
  it('Should return check function', () => {
    const DELAY_MS = 1000;
    const currentDate = new Date();
    jest.useFakeTimers().setSystemTime(currentDate.setMilliseconds(0));

    const { result } = renderHook(() => useTimer());

    act(() => {
      const value = result.current.check();
      expect(value).toBeUndefined();
    });

    jest.useFakeTimers().setSystemTime(currentDate.setMilliseconds(DELAY_MS));

    act(() => {
      const value = result.current.check();
      expect(value).toBeGreaterThanOrEqual(DELAY_MS);
    });

    jest.useRealTimers();
  });
});
