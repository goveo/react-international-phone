import { useCallback, useState } from 'react';

interface UseHistoryStateConfig {
  size?: number;
}

const defaultConfig: Required<UseHistoryStateConfig> = {
  size: 20,
};

interface SetStateConfig {
  /**
   * Update last history element (not create new one)
   */
  overrideLastHistoryItem?: boolean;
}

type HistoryActionResult<T> = { success: false } | { success: true; value: T };

export function useHistoryState<T extends Record<string, unknown> | string>(
  initialValue: T | (() => T),
  config?: UseHistoryStateConfig,
) {
  const { size } = { ...defaultConfig, ...config };

  const [state, _setState] = useState(initialValue);
  const [history, setHistory] = useState<T[]>([state]);

  const [pointer, setPointer] = useState<number>(0);

  const setState = useCallback(
    (value: T, config?: SetStateConfig) => {
      if (
        // compare entries if passed value is object
        (typeof value === 'object' &&
          Object.entries(value).toString() ===
            Object.entries(state).toString()) ||
        value === state
      ) {
        return;
      }

      if (config?.overrideLastHistoryItem) {
        setHistory((prev) => {
          return [...prev.slice(0, pointer), value];
        });
        // do not update pointer
      } else {
        const isSizeOverflow = history.length >= size;
        setHistory((prev) => [
          ...prev.slice(isSizeOverflow ? 1 : 0, pointer + 1),
          value,
        ]);
        if (!isSizeOverflow) {
          setPointer((prev) => prev + 1);
        }
      }
      _setState(value);
    },
    [state, pointer, history.length, size],
  );

  const undo = useCallback((): HistoryActionResult<T> => {
    if (pointer <= 0) {
      return { success: false };
    }

    const value = history[pointer - 1];
    _setState(value);
    setPointer((prev) => prev - 1);

    return { success: true, value };
  }, [history, pointer]);

  const redo = useCallback((): HistoryActionResult<T> => {
    if (pointer + 1 >= history.length) {
      return { success: false };
    }

    const value = history[pointer + 1];
    _setState(value);
    setPointer((prev) => prev + 1);

    return { success: true, value };
  }, [history, pointer]);

  return [state, setState, undo, redo] as const;
}
