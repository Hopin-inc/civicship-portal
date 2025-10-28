import { describe, it, expect } from "vitest";
import { isValidPhoneNumber } from "../validatePhoneNumber";

describe("isValidPhoneNumber", () => {
  describe("valid mobile numbers", () => {
    it("should accept valid Japanese mobile numbers", () => {
      expect(isValidPhoneNumber("+819012345678")).toBe(true);
      expect(isValidPhoneNumber("+818012345678")).toBe(true);
      expect(isValidPhoneNumber("+817012345678")).toBe(true);
    });

    it("should accept valid US mobile numbers", () => {
      expect(isValidPhoneNumber("+12025550123")).toBe(true);
      expect(isValidPhoneNumber("+13105550199")).toBe(true);
    });

    it("should accept valid UK mobile numbers", () => {
      expect(isValidPhoneNumber("+447911123456")).toBe(true);
      expect(isValidPhoneNumber("+447912345678")).toBe(true);
    });

    it("should accept valid Korean mobile numbers", () => {
      expect(isValidPhoneNumber("+821012345678")).toBe(true);
      expect(isValidPhoneNumber("+821112345678")).toBe(true);
    });
  });

  describe("invalid mobile numbers", () => {
    it("should reject numbers with all zeros", () => {
      expect(isValidPhoneNumber("+819000000000")).toBe(false);
      expect(isValidPhoneNumber("+12000000000")).toBe(false);
    });

    it("should reject numbers that are too short", () => {
      expect(isValidPhoneNumber("+8190123")).toBe(false);
      expect(isValidPhoneNumber("+1202555")).toBe(false);
    });

    it("should reject numbers that are too long", () => {
      expect(isValidPhoneNumber("+81901234567890123456")).toBe(false);
      expect(isValidPhoneNumber("+120255501231234567")).toBe(false);
    });

    it("should accept formatted numbers with separators", () => {
      expect(isValidPhoneNumber("+81-90-1234-5678")).toBe(true);
      expect(isValidPhoneNumber("+81 90 1234 5678")).toBe(true);
    });

    it("should reject invalid country codes", () => {
      expect(isValidPhoneNumber("+9999012345678")).toBe(false);
      expect(isValidPhoneNumber("+0012345678")).toBe(false);
    });
  });

  describe("fixed-line rejection", () => {
    it("should reject Japanese fixed-line numbers", () => {
      expect(isValidPhoneNumber("+81312345678")).toBe(false);
      expect(isValidPhoneNumber("+81661234567")).toBe(false);
    });

    it("should accept FIXED_LINE_OR_MOBILE numbers", () => {
      expect(isValidPhoneNumber("+12025551234")).toBe(true);
    });
  });

  describe("edge cases", () => {
    it("should reject undefined", () => {
      expect(isValidPhoneNumber(undefined)).toBe(false);
    });

    it("should reject empty string", () => {
      expect(isValidPhoneNumber("")).toBe(false);
    });

    it("should reject whitespace only", () => {
      expect(isValidPhoneNumber("   ")).toBe(false);
    });

    it("should reject numbers without country code", () => {
      expect(isValidPhoneNumber("09012345678")).toBe(false);
      expect(isValidPhoneNumber("2025550123")).toBe(false);
    });

    it("should reject malformed E.164 format", () => {
      expect(isValidPhoneNumber("81-90-1234-5678")).toBe(false);
      expect(isValidPhoneNumber("++819012345678")).toBe(false);
    });
  });
});
