import { useCallback, useState } from "react";

type UseHistoryStateReturn = [
  string, // state
  (v: string) => void, // setState
  () => boolean, // undo
  () => boolean, // redo
];

export const useHistoryState = (
  initialValue: string,
): UseHistoryStateReturn => {
  const [state, _setState] = useState(initialValue);
  const [history, setHistory] = useState<string[]>(
    typeof initialValue !== "undefined" ? [initialValue] : [],
  );
  const [pointer, setPointer] = useState<number>(
    typeof initialValue !== "undefined" ? 0 : -1,
  );

  const setState = useCallback(
    (value: string) => {
      if (value === state) return;
      setHistory((prev) => [...prev.slice(0, pointer + 1), value]);
      setPointer((prev) => prev + 1);
      _setState(value);
    },
    [state, pointer],
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
