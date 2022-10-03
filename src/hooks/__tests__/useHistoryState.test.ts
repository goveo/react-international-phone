import { act, renderHook } from "@testing-library/react-hooks/dom";

import { useHistoryState } from "../useHistoryState";

enum HookIndex {
  State = 0,
  SetState = 1,
  Undo = 2,
  Redo = 3,
}

describe("useHistoryState", () => {
  it("Should set initial value", () => {
    const initialValue = "Some test value";
    const { result } = renderHook(() => useHistoryState(initialValue));

    const [state] = result.current;

    expect(state).toBe(initialValue);
  });

  it("Should update state", () => {
    const { result } = renderHook(() => useHistoryState(""));
    const newValue = "New value";

    act(() => {
      result.current[HookIndex.SetState](newValue);
    });

    expect(result.current[HookIndex.State]).toBe(newValue);
  });

  it("Should support undo/redo", () => {
    const { result } = renderHook(() => useHistoryState("1"));

    act(() => {
      result.current[HookIndex.SetState]("2");
    });
    act(() => {
      result.current[HookIndex.SetState]("3");
    });
    expect(result.current[HookIndex.State]).toBe("3");

    act(() => {
      result.current[HookIndex.Undo]();
    });
    expect(result.current[0]).toBe("2");

    act(() => {
      result.current[HookIndex.Undo]();
    });
    act(() => {
      result.current[HookIndex.Undo]();
    });

    expect(result.current[HookIndex.State]).toBe("1");

    act(() => {
      result.current[HookIndex.Redo]();
    });
    act(() => {
      result.current[HookIndex.Redo]();
    });
    expect(result.current[HookIndex.State]).toBe("3");

    act(() => {
      result.current[HookIndex.Redo]();
    });
    expect(result.current[HookIndex.State]).toBe("3");

    act(() => {
      result.current[HookIndex.Undo]();
    });
    act(() => {
      result.current[HookIndex.Undo]();
    });
    act(() => {
      result.current[HookIndex.SetState]("100");
    });
    expect(result.current[HookIndex.State]).toBe("100");

    act(() => {
      result.current[HookIndex.Redo]();
    });
    expect(result.current[HookIndex.State]).toBe("100");
  });

  it("Should handle history size", () => {
    const { result } = renderHook(() => useHistoryState("0", { size: 2 }));

    act(() => {
      result.current[HookIndex.SetState]("1");
    });
    act(() => {
      result.current[HookIndex.SetState]("2");
    });
    act(() => {
      result.current[HookIndex.SetState]("3");
    });

    expect(result.current[HookIndex.State]).toBe("3");

    act(() => {
      result.current[HookIndex.Undo]();
    });
    act(() => {
      result.current[HookIndex.Undo]();
    });
    expect(result.current[HookIndex.State]).toBe("2");
  });

  it("Should handle skipHistorySave setState option", () => {
    const { result } = renderHook(() => useHistoryState("0", { size: 2 }));

    act(() => {
      result.current[HookIndex.SetState]("1");
    });
    act(() => {
      result.current[HookIndex.SetState]("2");
    });

    expect(result.current[HookIndex.State]).toBe("2");

    act(() => {
      result.current[HookIndex.SetState]("test", {
        overrideLastHistoryItem: true,
      });
    });
    expect(result.current[HookIndex.State]).toBe("test");

    act(() => {
      result.current[HookIndex.Undo]();
    });
    expect(result.current[HookIndex.State]).toBe("1");
  });

  it("Should not update history if same value have been set", () => {
    const { result } = renderHook(() => useHistoryState("1"));

    act(() => {
      result.current[HookIndex.SetState]("2");
    });
    act(() => {
      result.current[HookIndex.SetState]("2");
    });
    act(() => {
      result.current[HookIndex.Undo]();
    });

    expect(result.current[HookIndex.State]).toBe("1");
  });
});
