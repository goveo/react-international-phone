import { act, renderHook } from '@testing-library/react-hooks/dom';

import { useHistoryState } from '../useHistoryState';

enum HookIndex {
  State = 0,
  SetState = 1,
  Undo = 2,
  Redo = 3,
}

describe('useHistoryState', () => {
  test('should set initial value', () => {
    const initialValue = 'Some test value';
    const { result } = renderHook(() => useHistoryState(initialValue));

    const [state] = result.current;

    expect(state).toBe(initialValue);
  });

  test('should update state', () => {
    const { result } = renderHook(() => useHistoryState<string>(''));
    const newValue = 'New value';

    act(() => {
      result.current[HookIndex.SetState](newValue);
    });

    expect(result.current[HookIndex.State]).toBe(newValue);
  });

  test('should support state as object', () => {
    const initialValue = { phone: '+1', country: 'us' };
    const { result } = renderHook(() =>
      useHistoryState({ phone: '+1', country: 'us' }),
    );

    const [state] = result.current;
    expect(state).toMatchObject(initialValue);

    const newValue = { phone: '+2', country: 'test' };
    act(() => {
      result.current[HookIndex.SetState](newValue);
    });

    expect(result.current[HookIndex.State]).toMatchObject(newValue);
  });

  test('should support initial value setter function', () => {
    const initialValue = { phone: '+1', country: 'us' };
    const { result } = renderHook(() => useHistoryState(() => initialValue));

    const [state] = result.current;
    expect(state).toMatchObject(initialValue);
  });

  test('should support undo/redo', () => {
    const { result } = renderHook(() => useHistoryState<string>('1'));

    act(() => {
      result.current[HookIndex.SetState]('2');
    });
    act(() => {
      result.current[HookIndex.SetState]('3');
    });
    expect(result.current[HookIndex.State]).toBe('3');

    act(() => {
      result.current[HookIndex.Undo]();
    });
    expect(result.current[0]).toBe('2');

    act(() => {
      result.current[HookIndex.Undo]();
    });
    act(() => {
      result.current[HookIndex.Undo]();
    });

    expect(result.current[HookIndex.State]).toBe('1');

    act(() => {
      result.current[HookIndex.Redo]();
    });
    act(() => {
      result.current[HookIndex.Redo]();
    });
    expect(result.current[HookIndex.State]).toBe('3');

    act(() => {
      result.current[HookIndex.Redo]();
    });
    expect(result.current[HookIndex.State]).toBe('3');

    act(() => {
      result.current[HookIndex.Undo]();
    });
    act(() => {
      result.current[HookIndex.Undo]();
    });
    act(() => {
      result.current[HookIndex.SetState]('100');
    });
    expect(result.current[HookIndex.State]).toBe('100');

    act(() => {
      result.current[HookIndex.Redo]();
    });
    expect(result.current[HookIndex.State]).toBe('100');
  });

  test('should handle history size', () => {
    const { result } = renderHook(() =>
      useHistoryState<string>('0', { size: 2 }),
    );

    act(() => {
      result.current[HookIndex.SetState]('1');
    });
    act(() => {
      result.current[HookIndex.SetState]('2');
    });
    act(() => {
      result.current[HookIndex.SetState]('3');
    });

    expect(result.current[HookIndex.State]).toBe('3');

    act(() => {
      result.current[HookIndex.Undo]();
    });
    act(() => {
      result.current[HookIndex.Undo]();
    });
    expect(result.current[HookIndex.State]).toBe('2');
  });

  test('should handle overrideLastItem setState option', () => {
    const { result } = renderHook(() =>
      useHistoryState<string>('0', { size: 2 }),
    );

    act(() => {
      result.current[HookIndex.SetState]('1');
    });
    act(() => {
      result.current[HookIndex.SetState]('2');
    });

    expect(result.current[HookIndex.State]).toBe('2');

    act(() => {
      result.current[HookIndex.SetState]('test', {
        overrideLastItem: true,
      });
    });
    expect(result.current[HookIndex.State]).toBe('test');

    act(() => {
      result.current[HookIndex.Undo]();
    });
    expect(result.current[HookIndex.State]).toBe('1');
  });

  test('should not update history if same value have been set', () => {
    const { result } = renderHook(() => useHistoryState<string>('1'));

    act(() => {
      result.current[HookIndex.SetState]('2');
    });
    act(() => {
      result.current[HookIndex.SetState]('2');
    });
    act(() => {
      result.current[HookIndex.Undo]();
    });

    expect(result.current[HookIndex.State]).toBe('1');
  });

  test('should handle overrideLastItemDebounceMS', () => {
    jest.useFakeTimers();

    const waitForHistorySave = (ms = 1000) => jest.advanceTimersByTime(ms);

    const { result } = renderHook(() =>
      useHistoryState<string>('1', { overrideLastItemDebounceMS: 200 }),
    );

    act(() => {
      result.current[HookIndex.SetState]('2');
    });

    act(() => {
      result.current[HookIndex.SetState]('3');
    });

    act(waitForHistorySave);

    act(() => {
      result.current[HookIndex.SetState]('4');
    });

    act(waitForHistorySave);

    act(() => {
      result.current[HookIndex.SetState]('5');
    });

    act(() => {
      result.current[HookIndex.Undo]();
    });
    expect(result.current[HookIndex.State]).toBe('4');

    act(() => {
      result.current[HookIndex.Undo]();
    });
    expect(result.current[HookIndex.State]).toBe('3');

    act(() => {
      result.current[HookIndex.Undo]();
    });
    expect(result.current[HookIndex.State]).toBe('1');

    jest.useRealTimers();
  });

  test('should call onChange callback', () => {
    const onChange = jest.fn();
    const { result } = renderHook(() =>
      useHistoryState<string>('', {
        onChange,
      }),
    );
    expect(onChange.mock.calls.length).toBe(0);

    act(() => {
      result.current[HookIndex.SetState]('+380');
    });
    expect(result.current[HookIndex.State]).toBe('+380');
    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][0]).toBe('+380');

    act(() => {
      result.current[HookIndex.SetState]('+1 (204) ');
    });
    expect(result.current[HookIndex.State]).toBe('+1 (204) ');
    expect(onChange.mock.calls.length).toBe(2);
    expect(onChange.mock.calls[1][0]).toBe('+1 (204) ');

    act(() => {
      result.current[HookIndex.Undo]();
    });
    expect(result.current[HookIndex.State]).toBe('+380');
    expect(onChange.mock.calls.length).toBe(3);
    expect(onChange.mock.calls[2][0]).toBe('+380');

    act(() => {
      result.current[HookIndex.Redo]();
    });
    expect(result.current[HookIndex.State]).toBe('+1 (204) ');
    expect(onChange.mock.calls.length).toBe(4);
    expect(onChange.mock.calls[3][0]).toBe('+1 (204) ');
  });
});
