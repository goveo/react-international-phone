import { describe, expect, test } from "@jest/globals";

import { removeNonDigits } from "../removeNonDigits";

describe("removeNonDigits", () => {
  test("should remove non digits chars from string", () => {
    expect(removeNonDigits("+12345678")).toBe("12345678");
    expect(removeNonDigits("some(1234)test567890")).toBe("1234567890");
    expect(removeNonDigits("nonDigitsString")).toBe("");
    expect(removeNonDigits("1234")).toBe("1234");
    expect(removeNonDigits("")).toBe("");
  });
});
