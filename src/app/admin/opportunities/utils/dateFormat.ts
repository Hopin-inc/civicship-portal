// src/app/admin/opportunities/utils/dateFormat.ts

import dayjs from "dayjs";

/**
 * スロットの日時をISO形式に変換
 */
export function convertSlotToISO(slot: { startAt: string; endAt: string }) {
  return {
    startsAt: dayjs(slot.startAt).toISOString(),
    endsAt: dayjs(slot.endAt).toISOString(),
  };
}

/**
 * ISO文字列 → YYYY-MM-DD HH:mm
 */
export function formatISODateTime(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    const date = new Date(iso);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    const hh = String(date.getHours()).padStart(2, "0");
    const min = String(date.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
  } catch {
    return "";
  }
}

/**
 * ISO文字列 → 相対表現 or YYYY-MM-DD HH:mm
 */
export function formatRelativeDateTime(iso: string | null | undefined): string {
  if (!iso) return "";

  try {
    const date = new Date(iso);
    const now = new Date();

    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(
      2,
      "0",
    )}`;

    if (diffDays === 0) return `今日 ${time}`;
    if (diffDays === 1) return `昨日 ${time}`;
    if (diffDays < 7) return `${diffDays}日前 ${time}`;

    return formatISODateTime(iso);
  } catch {
    return formatISODateTime(iso);
  }
}
