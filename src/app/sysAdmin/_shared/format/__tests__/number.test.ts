import { describe, expect, it } from "vitest";
import { toCompactJa, toIntJa, toPct, toSignedPct } from "../number";

describe("toPct", () => {
  it("formats 0..1 as percentage with one decimal", () => {
    expect(toPct(0)).toBe("0.0%");
    expect(toPct(0.123)).toBe("12.3%");
    expect(toPct(1)).toBe("100.0%");
  });
  it("formats negative values", () => {
    expect(toPct(-0.05)).toBe("-5.0%");
  });
  it("returns fallback for null/undefined/NaN", () => {
    expect(toPct(null)).toBe("-");
    expect(toPct(undefined)).toBe("-");
    expect(toPct(Number.NaN)).toBe("-");
    expect(toPct(null, "—")).toBe("—");
  });
});

describe("toSignedPct", () => {
  it("prefixes + for positive", () => {
    expect(toSignedPct(0.08)).toBe("+8.0%");
  });
  it("keeps - for negative", () => {
    expect(toSignedPct(-0.2)).toBe("-20.0%");
  });
  it("no sign for zero", () => {
    expect(toSignedPct(0)).toBe("0.0%");
  });
});

describe("toIntJa", () => {
  it("adds Japanese thousands separator", () => {
    expect(toIntJa(0)).toBe("0");
    expect(toIntJa(1234)).toBe("1,234");
    expect(toIntJa(1000000)).toBe("1,000,000");
  });
  it("truncates fractions", () => {
    expect(toIntJa(1234.9)).toBe("1,234");
  });
  it("fallback for nil", () => {
    expect(toIntJa(null)).toBe("-");
  });
});

describe("toCompactJa", () => {
  it("passes small values through", () => {
    expect(toCompactJa(0)).toBe("0");
    expect(toCompactJa(9999)).toBe("9,999");
  });
  it("formats 10k boundary", () => {
    expect(toCompactJa(10000)).toBe("1.0万");
    expect(toCompactJa(99000)).toBe("9.9万");
    expect(toCompactJa(1200000)).toBe("120万");
  });
  it("formats 100M boundary", () => {
    expect(toCompactJa(100000000)).toBe("1.0億");
    expect(toCompactJa(1000000000)).toBe("10億");
  });
  it("fallback for nil", () => {
    expect(toCompactJa(undefined)).toBe("-");
  });
});
