import dayjs from "dayjs";
import { PhoneNumberUtil } from "google-libphonenumber";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";
import { getCommunityIdFromEnv } from "@/lib/metadata/communityMetadata";

dayjs.locale("ja");
dayjs.extend(relativeTime);

export const COMMUNITY_ID = getCommunityIdFromEnv();
export const PLACEHOLDER_IMAGE = `/communities/${COMMUNITY_ID}/placeholder.jpg`;

const YEAR_FMT = "YYYY年";
const MONTH_DATE_FMT = "M月D日(ddd)";
const TIME_FMT = "H:mm";
const FULL_FMT = `${YEAR_FMT}${MONTH_DATE_FMT} ${TIME_FMT}`;

export const displayDatetime = (date: Date | string, format: string = "YYYY-MM-DD HH:mm") => {
  return dayjs(date).format(format);
};

export const displayDuration = (start: Date | string, end?: Date | string) => {
  const dStart = dayjs(start);
  const dEnd = dayjs(end);
  if (!end) return displayDatetime(start, FULL_FMT);
  if (dStart.isSame(dEnd, "date")) {
    return `${dStart.format(FULL_FMT)}〜${dEnd.format(TIME_FMT)}`;
  } else if (dStart.isSame(dEnd, "year")) {
    return `${dStart.format(FULL_FMT)} 〜 ${dEnd.format(`${MONTH_DATE_FMT} ${TIME_FMT}`)}`;
  } else {
    return `${dStart.format(FULL_FMT)} 〜 ${dEnd.format(FULL_FMT)}`;
  }
};

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

export const wait = async (seconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, 1_000 * seconds));
};
