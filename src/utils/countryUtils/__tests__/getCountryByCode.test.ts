import { describe, expect, test } from "@jest/globals";

import { getCountryByCode } from "../getCountryByCode";

describe("getCountryByCode", () => {
  test("should get country by iso2 code", () => {
    const uaResult = getCountryByCode("ua");
    expect(uaResult).toHaveProperty("name", "Ukraine");
    expect(uaResult).toHaveProperty("iso2", "ua");
    expect(uaResult).toHaveProperty("dialCode", "380");

    expect(getCountryByCode("us")).toHaveProperty("name", "United States");
    expect(getCountryByCode("dk")).toHaveProperty("name", "Denmark");
  });

  test("should return undefined on unknown code", () => {
    expect(getCountryByCode("test")).toBeUndefined();
    expect(getCountryByCode("")).toBeUndefined();
  });
});
