import { describe, expect, test } from "@jest/globals";

import { applyMask } from "../applyMask";

describe("applyMask", () => {
  test("should apply mask", () => {
    expect(applyMask("12345678", ".. .. ....", ".")).toBe("12 34 5678");
    expect(applyMask("12345678", ".... ....", ".")).toBe("1234 5678");
    expect(applyMask("12345678", "## ## ## ##", "#")).toBe("12 34 56 78");
    expect(applyMask("12345678", ".. (..) .. ..", ".")).toBe("12 (34) 56 78");
  });

  test("should trim values that bigger than mask", () => {
    expect(applyMask("1234567890", ".. .. ....", ".")).toBe("12 34 5678");
    expect(applyMask("1234567890", ".... ....", ".")).toBe("1234 5678");
  });

  test("should apply mask on value that shorter that mask", () => {
    expect(applyMask("1234", ".. .. ....", ".")).toBe("12 34");
    expect(applyMask("1234", ".... ....", ".")).toBe("1234");
    expect(applyMask("1", ".... ....", ".")).toBe("1");
    expect(applyMask("", ".... ....", ".")).toBe("");
  });

  test("should accept all symbols", () => {
    expect(applyMask("abcdefgh", ".. .. ....", ".")).toBe("ab cd efgh");
    expect(applyMask("sometest", ".... ....", ".")).toBe("some test");
    expect(applyMask("+12345678", ".... ....", ".")).toBe("+123 4567");
    expect(applyMask("+123", ".... ....", ".")).toBe("+123");
  });
});
