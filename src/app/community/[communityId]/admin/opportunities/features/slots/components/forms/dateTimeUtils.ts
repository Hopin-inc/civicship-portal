import dayjs, { Dayjs } from "dayjs";

/**
 * candidate が now の分より前（過去）なら now（分精度）に補正した Dayjs を返す。
 * それ以外はそのまま返す。votes / 募集スロットの「過去日時を選べない」保証に使用。
 */
export function clampToFuture(candidate: Dayjs, now: Dayjs = dayjs()): Dayjs {
  return candidate.isBefore(now, "minute") ? now : candidate;
}

/**
 * 選択中の日付が当日なら time input の min（現在時刻 HH:mm）を返す。
 * 当日でない、または未選択なら undefined。
 */
export function resolveMinTime(
  date: Date | undefined,
  now: Dayjs = dayjs(),
): string | undefined {
  if (!date) return undefined;
  return dayjs(date).isSame(now, "day") ? now.format("HH:mm") : undefined;
}
