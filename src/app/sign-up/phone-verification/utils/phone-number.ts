import { isValidPhoneNumber as isValidPhoneNumberLib } from "react-phone-number-input";

/**
 * Validate phone number in E.164 format
 * @param phoneNumber - Phone number in E.164 format (e.g., +819012345678)
 * @returns true if valid, false otherwise
 */
export const isValidPhoneNumber = (
  phoneNumber: string | undefined
): boolean => {
  if (!phoneNumber) {
    return false;
  }
  return isValidPhoneNumberLib(phoneNumber);
};

/**
 * Format phone number for display
 * @param phoneNumber - Phone number in E.164 format
 * @returns Formatted phone number
 */
export const formatPhoneNumberForDisplay = (phoneNumber: string): string => {
  return phoneNumber;
};
