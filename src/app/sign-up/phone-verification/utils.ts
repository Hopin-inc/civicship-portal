export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/[-\s]/g, "");

  if (cleaned.startsWith("0")) {
    return "+81" + cleaned.substring(1);
  }

  if (cleaned.startsWith("+")) {
    return cleaned;
  }

  return "+81" + cleaned;
};
