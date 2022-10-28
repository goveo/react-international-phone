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

type UseHistoryStateReturn = [
  string, // state
  (v: string, config?: SetStateConfig) => void, // setState
  () => boolean, // undo
  () => boolean, // redo
];

export const useHistoryState = (
  initialValue: string,
  config?: UseHistoryStateConfig,
): UseHistoryStateReturn => {
  const { size } = { ...defaultConfig, ...config };

  const [state, _setState] = useState(initialValue);
  const [history, setHistory] = useState<string[]>([initialValue]);
  const [pointer, setPointer] = useState<number>(0);

  const setState = useCallback(
    (value: string, config?: SetStateConfig) => {
      if (value === state) return;

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

  const undo = useCallback(() => {
    if (pointer <= 0) {
      return false;
    }

    _setState(history[pointer - 1]);
    setPointer((prev) => prev - 1);
    return true;
  }, [history, pointer]);

  const redo = useCallback(() => {
    if (pointer + 1 >= history.length) {
      return false;
    }

    _setState(history[pointer + 1]);
    setPointer((prev) => prev + 1);
    return true;
  }, [history, pointer]);

  return [state, setState, undo, redo];
};
