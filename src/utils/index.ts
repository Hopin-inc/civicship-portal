import dayjs from "dayjs";
import { PhoneNumberUtil } from "google-libphonenumber";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

dayjs.locale("ja");
dayjs.extend(relativeTime);

export const PLACEHOLDER_IMAGE = `/communities/${COMMUNITY_ID}/placeholder.jpg`;

export const displayRelativeTime = (date: Date | string) => {
  return dayjs(date).fromNow();
};

export const displayPhoneNumber = (phoneNumber: string) => {
  const phoneUtil = PhoneNumberUtil.getInstance();
  return phoneUtil.formatOutOfCountryCallingNumber(
    phoneUtil.parseAndKeepRawInput(phoneNumber, "JP"),
    "JP",
  );
};

export const displayMultipleUsers = (names: string[], numDisplayed: number = 1, blankText: string = "なし") => {
  if (names.length === 0) return blankText;
  const numHidden = names.length - numDisplayed;
  const displayedNames = names.slice(0, numDisplayed);
  let result = displayedNames.join(", ");
  if (numHidden > 0) {
    result += ` ほか${ numHidden }名`;
  }
  return result;
}

export const wait = async (seconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, 1_000 * seconds));
};
