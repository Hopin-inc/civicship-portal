import { describe, expect, it } from "vitest";
import { formatIsoWeek, formatJstDate, formatJstMonth, formatJstMonthShort } from "../date";

describe("formatJstMonth", () => {
  it("returns year/month in Japanese", () => {
    expect(formatJstMonth("2026-04-01T00:00:00+09:00")).toBe("2026年4月");
  });
  it("handles UTC → JST boundary", () => {
    // 2025-12-31T15:00Z == 2026-01-01 00:00 JST
    expect(formatJstMonth("2025-12-31T15:00:00Z")).toBe("2026年1月");
  });
  it("returns '-' for null/invalid", () => {
    expect(formatJstMonth(null)).toBe("-");
    expect(formatJstMonth(undefined)).toBe("-");
    expect(formatJstMonth("not-a-date")).toBe("-");
  });
});

describe("formatJstMonthShort", () => {
  it("returns YY/MM", () => {
    expect(formatJstMonthShort("2026-04-01T00:00:00+09:00")).toBe("26/04");
  });
});

describe("formatIsoWeek", () => {
  it("returns YYYY-Www", () => {
    // 2026-04-13 is a Monday; that week contains Thursday 2026-04-16 (week 16)
    expect(formatIsoWeek("2026-04-13T00:00:00+09:00")).toBe("2026-W16");
  });
  it("handles year boundary", () => {
    // 2025-01-01 00:00 JST == 2024-12-31T15:00Z. ISO week for that date is W01 2025
    expect(formatIsoWeek("2025-01-01T00:00:00+09:00")).toBe("2025-W01");
  });
});

describe("formatJstDate", () => {
  it("returns YYYY-MM-DD", () => {
    expect(formatJstDate("2026-04-22T00:00:00+09:00")).toBe("2026-04-22");
  });
});
