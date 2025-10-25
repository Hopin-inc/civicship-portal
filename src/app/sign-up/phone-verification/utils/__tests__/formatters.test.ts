import { describe, expect, it } from "vitest";
import { formatPhoneNumber } from "../formatters";

describe("formatPhoneNumber", () => {
  it("should format phone number starting with 0", () => {
    expect(formatPhoneNumber("09012345678")).toBe("+819012345678");
  });

  it("should format phone number with hyphens", () => {
    expect(formatPhoneNumber("090-1234-5678")).toBe("+819012345678");
  });

  it("should format phone number with spaces", () => {
    expect(formatPhoneNumber("090 1234 5678")).toBe("+819012345678");
  });

  it("should keep phone number already starting with +81", () => {
    expect(formatPhoneNumber("+819012345678")).toBe("+819012345678");
  });

  it("should format phone number without leading 0 or +", () => {
    expect(formatPhoneNumber("9012345678")).toBe("+819012345678");
  });

  it("should handle empty string", () => {
    expect(formatPhoneNumber("")).toBe("+81");
  });

  it("should remove multiple hyphens and spaces", () => {
    expect(formatPhoneNumber("090--1234  5678")).toBe("+819012345678");
  });
});
