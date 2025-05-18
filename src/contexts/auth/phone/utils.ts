import { phoneVerificationState } from "@/lib/firebase/firebase";

const isPhoneVerified = (): boolean => {
  return phoneVerificationState.verified;
};

const getVerifiedPhoneNumber = (): string | null => {
  return phoneVerificationState.verified ? phoneVerificationState.phoneNumber : null;
};

const normalizePhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/[-\s]/g, "");

  if (cleaned.startsWith("0")) {
    return "+81" + cleaned.substring(1);
  }

  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  return "+81" + cleaned;
};

export { isPhoneVerified, getVerifiedPhoneNumber, normalizePhoneNumber };
