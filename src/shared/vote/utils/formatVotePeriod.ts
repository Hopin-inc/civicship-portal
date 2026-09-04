import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { APP_TIMEZONE } from "@/lib/constants";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * 投票期間を "M/D HH:mm - M/D HH:mm" 形式で整形する。
 * 同日内なら "M/D HH:mm - HH:mm" に省略する。
 */
export function formatVotePeriod(startsAt: Date | string, endsAt: Date | string): string {
  const start = dayjs(startsAt).tz(APP_TIMEZONE);
  const end = dayjs(endsAt).tz(APP_TIMEZONE);
  const sameDay = start.isSame(end, "day");
  if (sameDay) {
    return `${start.format("M/D HH:mm")} - ${end.format("HH:mm")}`;
  }
  return `${start.format("M/D HH:mm")} - ${end.format("M/D HH:mm")}`;
}
