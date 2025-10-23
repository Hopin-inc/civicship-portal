import { PhoneValidationResult } from "../types";
import { formatPhoneNumber } from "./formatters";
import { PHONE_VERIFICATION_CONSTANTS } from "./phoneVerificationConstants";

export function validatePhoneNumber(phoneNumber: string): PhoneValidationResult {
  const formattedPhone = formatPhoneNumber(phoneNumber);
  const digitsOnly = formattedPhone.replace(/\D/g, "");
  const isValid =
    digitsOnly.startsWith("81") &&
    digitsOnly.length === PHONE_VERIFICATION_CONSTANTS.PHONE_NUMBER_LENGTH;

  return {
    isValid,
    formattedPhone,
    digitsOnly,
  };
}
