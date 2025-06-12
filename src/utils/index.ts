import dayjs from "dayjs";
import { PhoneNumberUtil } from "google-libphonenumber";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";

dayjs.locale("ja");
dayjs.extend(relativeTime);

export const COMMUNITY_ID = "neo88";
export const PLACEHOLDER_IMAGE = "/images/placeholder.jpg";


const YEAR_FMT = "YYYY年";
const MONTH_DATE_FMT = "M月D日(ddd)";
const TIME_FMT = "H:mm";
const FULL_FMT = `${YEAR_FMT}${MONTH_DATE_FMT} ${TIME_FMT}`;

export const displayDatetime = (date: Date | string | null | undefined, format: string = FULL_FMT, nullString: string = "未設定") => {
  if (!date) return nullString;
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
