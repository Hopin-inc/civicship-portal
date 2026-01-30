import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ja";

dayjs.locale("ja");
dayjs.extend(relativeTime);

export const PLACEHOLDER_IMAGE = `/images/placeholder.jpg`;

export const displayRelativeTime = (date: Date | string) => {
  return dayjs(date).fromNow();
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
