import { describe, expect, it } from "vitest";
import { isValidPhoneNumber } from "../validatePhoneNumber";

describe("isValidPhoneNumber", () => {
  describe("Japanese phone numbers", () => {
    it.each([
      "+819012345678",
      "+818012345678",
      "+817012345678",
    ])("should accept valid mobile number %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    });

    it.each([
      ["+81312345678", "Tokyo landline (03)"],
      ["+81612345678", "Osaka landline (06)"],
    ])("should reject %s (%s)", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });

    it.each([
      ["+8190123456", "Too short"],
      ["+8190123456789", "Too long"],
      ["+819912345678", "Invalid prefix"],
    ])("should reject %s (%s)", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });
  });

  describe("US phone numbers", () => {
    it.each([
      "+16505551234",
      "+12025551234",
      "+13105551234",
    ])("should accept valid mobile number %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    });

    it("should accept numbers that are FIXED_LINE_OR_MOBILE", () => {
      // Note: US numbers are often FIXED_LINE_OR_MOBILE.
      // We accept them to avoid false negatives for valid mobile numbers
      // that can't be distinguished from landlines.
      const result = isValidPhoneNumber("+12125551234");
      expect(result).toBe(true);
    });

    it.each([
      ["+1650555123", "Too short"],
      ["+165055512345", "Too long"],
      ["+11234567890", "Invalid area code (NANP area codes cannot start with 1)"],
    ])("should reject %s (%s)", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });
  });

  describe("UK phone numbers", () => {
    it.each([
      "+447700900123",
      "+447911123456",
      "+447400123456",
    ])("should accept valid mobile number %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    });

    it.each([
      ["+442012345678", "London landline (020)"],
      ["+441612345678", "Manchester landline (0161)"],
    ])("should reject %s (%s)", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });

    it.each([
      ["+44770090012", "Too short"],
      ["+446700900123", "Invalid mobile prefix"],
    ])("should reject %s (%s)", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });
  });

  describe("Korean phone numbers", () => {
    it.each([
      "+821012345678",
      "+821112345678",
      "+821612345678",
    ])("should accept valid mobile number %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    });

    it.each([
      ["+82212345678", "Seoul landline (02)"],
      ["+82512345678", "Busan landline (051)"],
    ])("should reject %s (%s)", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });

    it.each([
      ["+82101234567", "Too short"],
      ["+820012345678", "Invalid prefix"],
    ])("should reject %s (%s)", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });
  });

  describe("Australian phone numbers", () => {
    it.each([
      "+61412345678",
      "+61423456789",
    ])("should accept valid mobile number %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    });

    it.each([
      ["+61212345678", "Sydney landline (02)"],
      ["+61312345678", "Melbourne landline (03)"],
    ])("should reject %s (%s)", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });
  });

  describe("German phone numbers", () => {
    it.each([
      "+4915112345678",
      "+4916012345678",
      "+4917012345678",
    ])("should accept valid mobile number %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    });

    it.each([
      ["+493012345678", "Berlin landline (030)"],
      ["+498912345678", "Munich landline (089)"],
    ])("should reject %s (%s)", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });
  });

  describe("French phone numbers", () => {
    it.each([
      "+33612345678",
      "+33712345678",
    ])("should accept valid mobile number %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    });

    it.each([
      ["+33112345678", "Paris landline (01)"],
      ["+33412345678", "Lyon landline (04)"],
    ])("should reject %s (%s)", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("should reject undefined", () => {
      expect(isValidPhoneNumber(undefined)).toBe(false);
    });

    it("should reject empty string", () => {
      expect(isValidPhoneNumber("")).toBe(false);
    });

    it("should reject null-like values", () => {
      // Test runtime behavior if null is passed, bypassing TypeScript types
      expect(isValidPhoneNumber(null as any)).toBe(false);
    });

    it.each([
      ["09012345678", "Japanese mobile without country code"],
      ["6505551234", "US number without country code"],
    ])("should reject %s (%s)", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });

    it.each([
      "abc",
      "123",
      "+",
      "++819012345678",
    ])("should reject invalid format: %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });

    it.each([
      "+9999012345678",
      "+0009012345678",
    ])("should reject invalid country code: %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });

    it.each([
      "+81 90 1234 5678",
      "+1 650 555 1234",
    ])("should handle spaces in phone number: %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    });

    it.each([
      "+81-90-1234-5678",
      "+1-650-555-1234",
    ])("should handle hyphens in phone number: %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    });

    it("should handle parentheses in phone numbers", () => {
      expect(isValidPhoneNumber("+1 (650) 555-1234")).toBe(true);
    });
  });

  describe("International format validation", () => {
    it("should only accept numbers starting with +", () => {
      // Without +, should fail
      expect(isValidPhoneNumber("819012345678")).toBe(false);
      // With +, should pass
      expect(isValidPhoneNumber("+819012345678")).toBe(true);
    });

    it.each([
      "+819012345678",
      "+16505551234",
    ])("should validate complete international format: %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    });

    it.each([
      ["+81", "Japan country code only"],
      ["+1", "US country code only"],
    ])("should reject %s (%s)", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });
  });

  describe("Maximum length validation", () => {
    it.each([
      "+819012345678901234567890",
      "+165055512341234567890",
    ])("should reject excessively long number: %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });
  });

  describe("Special service numbers", () => {
    it.each([
      ["+81110", "Japan emergency"],
      ["+1911", "US emergency"],
      ["+44999", "UK emergency"],
    ])("should reject emergency number %s (%s)", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });

    it.each([
      ["+81171", "Japan short code"],
      ["+44150", "UK short code"],
    ])("should reject short code %s (%s)", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });

    it.each([
      ["+810120123456", "Japan toll-free"],
      ["+18001234567", "US toll-free"],
    ])("should reject toll-free number %s (%s)", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(false);
    });
  });

  describe("Real-world number formats", () => {
    it.each([
      "+81 90-1234-5678",
      "+81(90)1234-5678",
    ])("should handle Japanese format: %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    });

    it.each([
      "+1 (650) 555-1234",
      "+1-650-555-1234",
      "+1 650 555 1234",
    ])("should handle US format: %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    });

    it.each([
      "+44 7700 900123",
      "+44-7700-900123",
    ])("should handle UK format: %s", (phoneNumber) => {
      expect(isValidPhoneNumber(phoneNumber)).toBe(true);
    });
  });
});
