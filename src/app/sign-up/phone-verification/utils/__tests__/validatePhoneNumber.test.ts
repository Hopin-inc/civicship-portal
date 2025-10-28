import { describe, expect, it } from "vitest";
import { isValidPhoneNumber } from "../validatePhoneNumber";

describe("isValidPhoneNumber", () => {
  describe("Japanese phone numbers", () => {
    it("should accept valid mobile numbers", () => {
      expect(isValidPhoneNumber("+819012345678")).toBe(true);
      expect(isValidPhoneNumber("+818012345678")).toBe(true);
      expect(isValidPhoneNumber("+817012345678")).toBe(true);
    });

    it("should reject landline numbers", () => {
      // Tokyo landline (03)
      expect(isValidPhoneNumber("+81312345678")).toBe(false);
      // Osaka landline (06)
      expect(isValidPhoneNumber("+81612345678")).toBe(false);
    });

    it("should reject invalid Japanese numbers", () => {
      // Too short
      expect(isValidPhoneNumber("+8190123456")).toBe(false);
      // Too long
      expect(isValidPhoneNumber("+8190123456789")).toBe(false);
      // Invalid prefix
      expect(isValidPhoneNumber("+819912345678")).toBe(false);
    });
  });

  describe("US phone numbers", () => {
    it("should accept valid mobile numbers", () => {
      expect(isValidPhoneNumber("+16505551234")).toBe(true);
      expect(isValidPhoneNumber("+12025551234")).toBe(true);
      expect(isValidPhoneNumber("+13105551234")).toBe(true);
    });

    it("should accept numbers that are FIXED_LINE_OR_MOBILE", () => {
      // Note: US numbers are often FIXED_LINE_OR_MOBILE.
      // We accept them to avoid false negatives for valid mobile numbers
      // that can't be distinguished from landlines.
      const result = isValidPhoneNumber("+12125551234");
      expect(result).toBe(true);
    });

    it("should reject invalid US numbers", () => {
      // Too short
      expect(isValidPhoneNumber("+1650555123")).toBe(false);
      // Too long
      expect(isValidPhoneNumber("+165055512345")).toBe(false);
      // Invalid format
      expect(isValidPhoneNumber("+11234567890")).toBe(false);
    });
  });

  describe("UK phone numbers", () => {
    it("should accept valid mobile numbers", () => {
      expect(isValidPhoneNumber("+447700900123")).toBe(true);
      expect(isValidPhoneNumber("+447911123456")).toBe(true);
      expect(isValidPhoneNumber("+447400123456")).toBe(true);
    });

    it("should reject landline numbers", () => {
      // London landline (020)
      expect(isValidPhoneNumber("+442012345678")).toBe(false);
      // Manchester landline (0161)
      expect(isValidPhoneNumber("+441612345678")).toBe(false);
    });

    it("should reject invalid UK numbers", () => {
      // Too short
      expect(isValidPhoneNumber("+44770090012")).toBe(false);
      // Invalid mobile prefix
      expect(isValidPhoneNumber("+446700900123")).toBe(false);
    });
  });

  describe("Korean phone numbers", () => {
    it("should accept valid mobile numbers", () => {
      expect(isValidPhoneNumber("+821012345678")).toBe(true);
      expect(isValidPhoneNumber("+821112345678")).toBe(true);
      expect(isValidPhoneNumber("+821612345678")).toBe(true);
    });

    it("should reject landline numbers", () => {
      // Seoul landline (02)
      expect(isValidPhoneNumber("+82212345678")).toBe(false);
      // Busan landline (051)
      expect(isValidPhoneNumber("+82512345678")).toBe(false);
    });

    it("should reject invalid Korean numbers", () => {
      // Too short
      expect(isValidPhoneNumber("+82101234567")).toBe(false);
      // Invalid prefix
      expect(isValidPhoneNumber("+820012345678")).toBe(false);
    });
  });

  describe("Australian phone numbers", () => {
    it("should accept valid mobile numbers", () => {
      expect(isValidPhoneNumber("+61412345678")).toBe(true);
      expect(isValidPhoneNumber("+61423456789")).toBe(true);
    });

    it("should reject landline numbers", () => {
      // Sydney landline (02)
      expect(isValidPhoneNumber("+61212345678")).toBe(false);
      // Melbourne landline (03)
      expect(isValidPhoneNumber("+61312345678")).toBe(false);
    });
  });

  describe("German phone numbers", () => {
    it("should accept valid mobile numbers", () => {
      expect(isValidPhoneNumber("+4915112345678")).toBe(true);
      expect(isValidPhoneNumber("+4916012345678")).toBe(true);
      expect(isValidPhoneNumber("+4917012345678")).toBe(true);
    });

    it("should reject landline numbers", () => {
      // Berlin landline (030)
      expect(isValidPhoneNumber("+493012345678")).toBe(false);
      // Munich landline (089)
      expect(isValidPhoneNumber("+498912345678")).toBe(false);
    });
  });

  describe("French phone numbers", () => {
    it("should accept valid mobile numbers", () => {
      expect(isValidPhoneNumber("+33612345678")).toBe(true);
      expect(isValidPhoneNumber("+33712345678")).toBe(true);
    });

    it("should reject landline numbers", () => {
      // Paris landline (01)
      expect(isValidPhoneNumber("+33112345678")).toBe(false);
      // Lyon landline (04)
      expect(isValidPhoneNumber("+33412345678")).toBe(false);
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
      expect(isValidPhoneNumber(null as any)).toBe(false);
    });

    it("should reject numbers without country code", () => {
      expect(isValidPhoneNumber("09012345678")).toBe(false);
      expect(isValidPhoneNumber("6505551234")).toBe(false);
    });

    it("should reject invalid formats", () => {
      expect(isValidPhoneNumber("abc")).toBe(false);
      expect(isValidPhoneNumber("123")).toBe(false);
      expect(isValidPhoneNumber("+")).toBe(false);
      expect(isValidPhoneNumber("++819012345678")).toBe(false);
    });

    it("should reject numbers with invalid country codes", () => {
      expect(isValidPhoneNumber("+9999012345678")).toBe(false);
      expect(isValidPhoneNumber("+0009012345678")).toBe(false);
    });

    it("should handle spaces in phone numbers", () => {
      // libphonenumber-js should handle spaces
      expect(isValidPhoneNumber("+81 90 1234 5678")).toBe(true);
      expect(isValidPhoneNumber("+1 650 555 1234")).toBe(true);
    });

    it("should handle hyphens in phone numbers", () => {
      // libphonenumber-js should handle hyphens
      expect(isValidPhoneNumber("+81-90-1234-5678")).toBe(true);
      expect(isValidPhoneNumber("+1-650-555-1234")).toBe(true);
    });

    it("should handle parentheses in phone numbers", () => {
      // libphonenumber-js should handle parentheses
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

    it("should validate complete international format", () => {
      // Valid formats
      expect(isValidPhoneNumber("+819012345678")).toBe(true);
      expect(isValidPhoneNumber("+16505551234")).toBe(true);

      // Invalid: missing digits
      expect(isValidPhoneNumber("+81")).toBe(false);
      expect(isValidPhoneNumber("+1")).toBe(false);
    });
  });

  describe("Maximum length validation", () => {
    it("should reject excessively long numbers", () => {
      // Extremely long number
      expect(isValidPhoneNumber("+819012345678901234567890")).toBe(false);
      expect(isValidPhoneNumber("+165055512341234567890")).toBe(false);
    });
  });

  describe("Special service numbers", () => {
    it("should reject emergency numbers", () => {
      expect(isValidPhoneNumber("+81110")).toBe(false); // Japan emergency
      expect(isValidPhoneNumber("+1911")).toBe(false); // US emergency
      expect(isValidPhoneNumber("+44999")).toBe(false); // UK emergency
    });

    it("should reject short codes", () => {
      expect(isValidPhoneNumber("+81171")).toBe(false); // Japan short code
      expect(isValidPhoneNumber("+44150")).toBe(false); // UK short code
    });

    it("should reject toll-free numbers", () => {
      expect(isValidPhoneNumber("+810120123456")).toBe(false); // Japan toll-free
      expect(isValidPhoneNumber("+18001234567")).toBe(false); // US toll-free
    });
  });

  describe("Type validation", () => {
    it("should only accept MOBILE type", () => {
      // This is implicitly tested by landline rejection tests
      // The function checks: type === "MOBILE" || type === "FIXED_LINE_OR_MOBILE"

      // Valid mobile numbers
      expect(isValidPhoneNumber("+819012345678")).toBe(true);

      // Invalid: landlines should be rejected
      expect(isValidPhoneNumber("+81312345678")).toBe(false);
    });

    it("should accept FIXED_LINE_OR_MOBILE type", () => {
      // US numbers are often classified as FIXED_LINE_OR_MOBILE
      // This is intentional to avoid false negatives
      const result = isValidPhoneNumber("+16505551234");
      expect(result).toBe(true);
    });
  });

  describe("Real-world number formats", () => {
    it("should handle numbers as entered by users in Japan", () => {
      expect(isValidPhoneNumber("+81 90-1234-5678")).toBe(true);
      expect(isValidPhoneNumber("+81(90)1234-5678")).toBe(true);
    });

    it("should handle numbers as entered by users in US", () => {
      expect(isValidPhoneNumber("+1 (650) 555-1234")).toBe(true);
      expect(isValidPhoneNumber("+1-650-555-1234")).toBe(true);
      expect(isValidPhoneNumber("+1 650 555 1234")).toBe(true);
    });

    it("should handle numbers as entered by users in UK", () => {
      expect(isValidPhoneNumber("+44 7700 900123")).toBe(true);
      expect(isValidPhoneNumber("+44-7700-900123")).toBe(true);
    });
  });
});
