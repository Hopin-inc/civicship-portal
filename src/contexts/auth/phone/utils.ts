
const isPhoneVerified = (): boolean => {
  console.warn("isPhoneVerified() is deprecated. Use useAuth().isPhoneVerified instead.");
  return false;
};

const getVerifiedPhoneNumber = (): string | null => {
  console.warn("getVerifiedPhoneNumber() is deprecated. Use useAuth().phoneNumber instead.");
  return null;
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
