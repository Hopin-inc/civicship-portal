import { parsePhoneNumber } from "libphonenumber-js/max";

export const isValidPhoneNumber = (
  phoneNumber: string | undefined
): boolean => {
  if (!phoneNumber) {
    return false;
  }
  
  try {
    const parsed = parsePhoneNumber(phoneNumber);
    return parsed.isValid();
  } catch {
    return false;
  }
};
