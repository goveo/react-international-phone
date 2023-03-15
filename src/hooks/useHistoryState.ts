import { useState } from 'react';

import { useTimer } from './useTimer';

interface UseHistoryStateConfig<T> {
  size?: number;
  overrideLastItemDebounceMS?: number;
  onChange?: (data: T) => void;
}

const defaultConfig = {
  size: 20,
  overrideLastItemDebounceMS: -1, // overriding is disabled by default
};

interface SetStateConfig {
  /**
   * Update last history element (not create new one)
   */
  overrideLastItem?: boolean;
}

type HistoryActionResult<T> = { success: false } | { success: true; value: T };

export function useHistoryState<T extends Record<string, unknown> | string>(
  initialValue: T | (() => T),
  config?: UseHistoryStateConfig<T>,
) {
  const { size, overrideLastItemDebounceMS, onChange } = {
    ...defaultConfig,
    ...config,
  };

  const [state, _setState] = useState(initialValue);
  const [history, setHistory] = useState<T[]>([state]);
  const [pointer, setPointer] = useState<number>(0);

  const timer = useTimer();

  const setState = (value: T, config?: SetStateConfig) => {
    if (
      // compare entries if passed value is object
      (typeof value === 'object' &&
        Object.entries(value).toString() ===
          Object.entries(state).toString()) ||
      value === state
    ) {
      return;
    }

    const isOverridingEnabled = overrideLastItemDebounceMS > 0;

    const timePassedSinceLastChange = timer.check();
    const debounceTimePassed =
      isOverridingEnabled && timePassedSinceLastChange !== undefined
        ? timePassedSinceLastChange > overrideLastItemDebounceMS
        : true;

    const shouldOverrideLastItem =
      // use value of config.overrideLastItem if passed
      config?.overrideLastItem !== undefined
        ? config.overrideLastItem
        : !debounceTimePassed;

    if (shouldOverrideLastItem) {
      // do not update pointer
      setHistory((prev) => {
        return [...prev.slice(0, pointer), value];
      });
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
    onChange?.(value);
  };

  const undo = (): HistoryActionResult<T> => {
    if (pointer <= 0) {
      return { success: false };
    }

    const value = history[pointer - 1];
    _setState(value);
    setPointer((prev) => prev - 1);

    onChange?.(value);
    return { success: true, value };
  };

  const redo = (): HistoryActionResult<T> => {
    if (pointer + 1 >= history.length) {
      return { success: false };
    }

    const value = history[pointer + 1];
    _setState(value);
    setPointer((prev) => prev + 1);

    onChange?.(value);
    return { success: true, value };
  };

  return [state, setState, undo, redo] as const;
}
