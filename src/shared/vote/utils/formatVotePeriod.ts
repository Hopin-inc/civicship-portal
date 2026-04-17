import dayjs from "dayjs";

/**
 * 投票期間を "M/D HH:mm - M/D HH:mm" 形式で整形する。
 * 同日内なら "M/D HH:mm - HH:mm" に省略する。
 */
export function formatVotePeriod(startsAt: Date | string, endsAt: Date | string): string {
  const start = dayjs(startsAt);
  const end = dayjs(endsAt);
  const sameDay = start.isSame(end, "day");
  if (sameDay) {
    return `${start.format("M/D HH:mm")} - ${end.format("HH:mm")}`;
  }
  return `${start.format("M/D HH:mm")} - ${end.format("M/D HH:mm")}`;
}
