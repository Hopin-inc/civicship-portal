import { phoneVerificationState } from "@/lib/firebase/firebase";

const isPhoneVerified = (): boolean => {
  return phoneVerificationState.verified;
};

const getVerifiedPhoneNumber = (): string | null => {
  return phoneVerificationState.verified ? phoneVerificationState.phoneNumber : null;
};

export { isPhoneVerified, getVerifiedPhoneNumber };
