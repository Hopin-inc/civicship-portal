import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import { getCommunityIdFromEnv } from "@/lib/communities/config";
import parsePhoneNumberFromString from "libphonenumber-js/min";

dayjs.locale("ja");
dayjs.extend(relativeTime);

// Data URL fallback for placeholder image (1x1 gray pixel)
// This prevents infinite reload loops when community-specific placeholder doesn't exist
const PLACEHOLDER_DATA_URL = "data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==";

export const PLACEHOLDER_IMAGE = `/communities/${getCommunityIdFromEnv()}/placeholder.jpg`;

// Use this for error fallback to avoid infinite reload when placeholder doesn't exist
export const FALLBACK_IMAGE = PLACEHOLDER_DATA_URL;

export const displayRelativeTime = (date: Date | string) => {
  return dayjs(date).fromNow();
};

export const displayPhoneNumber = (phoneNumber: string) => {
  const parsed = parsePhoneNumberFromString(phoneNumber, "JP");
  if (!parsed) return phoneNumber;
  return parsed.formatInternational();
};

export const displayMultipleUsers = (
  names: string[],
  numDisplayed: number = 1,
  blankText: string = "なし",
) => {
  if (names.length === 0) return blankText;
  const numHidden = names.length - numDisplayed;
  const displayedNames = names.slice(0, numDisplayed);
  let result = displayedNames.join(", ");
  if (numHidden > 0) {
    result += ` ほか${numHidden}名`;
  }
  return result;
};

export const wait = async (seconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, 1_000 * seconds));
};
