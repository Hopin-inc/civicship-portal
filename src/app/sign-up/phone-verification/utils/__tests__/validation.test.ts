import { describe, expect, it } from "vitest";
import { validatePhoneNumber } from "../validation";
import { PHONE_VERIFICATION_CONSTANTS } from "../phoneVerificationConstants";

describe("validatePhoneNumber", () => {
  it("should validate correct Japanese phone number", () => {
    const result = validatePhoneNumber("09012345678");
    expect(result.isValid).toBe(true);
    expect(result.formattedPhone).toBe("+819012345678");
    expect(result.digitsOnly).toBe("819012345678");
  });

  it("should validate phone number with country code", () => {
    const result = validatePhoneNumber("+819012345678");
    expect(result.isValid).toBe(true);
  });

  it("should invalidate phone number with wrong length", () => {
    const result = validatePhoneNumber("090123456");
    expect(result.isValid).toBe(false);
  });

  it("should invalidate phone number with too many digits", () => {
    const result = validatePhoneNumber("0901234567890");
    expect(result.isValid).toBe(false);
  });

  it("should invalidate phone number not starting with 81", () => {
    const result = validatePhoneNumber("+1234567890");
    expect(result.isValid).toBe(false);
  });

  it("should invalidate empty phone number", () => {
    const result = validatePhoneNumber("");
    expect(result.isValid).toBe(false);
  });

  it("should validate phone number with hyphens and spaces", () => {
    const result = validatePhoneNumber("090-1234-5678");
    expect(result.isValid).toBe(true);
  });

  it("should validate phone number matching the constant length", () => {
    const result = validatePhoneNumber("09012345678");
    expect(result.digitsOnly.length).toBe(PHONE_VERIFICATION_CONSTANTS.PHONE_NUMBER_LENGTH);
    expect(result.isValid).toBe(true);
  });
});
