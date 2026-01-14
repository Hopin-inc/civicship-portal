import { parsePhoneNumber } from "libphonenumber-js/max";

export const isValidPhoneNumber = (
  phoneNumber: string | undefined
): boolean => {
  if (!phoneNumber) {
    return false;
  }
  
  try {
    const parsed = parsePhoneNumber(phoneNumber);
    if (!parsed.isValid()) {
      return false;
    }
    
    const type = parsed.getType();
    return type === "MOBILE" || type === "FIXED_LINE_OR_MOBILE";
  } catch {
    return false;
  }
};
