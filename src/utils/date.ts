import { format, parse } from "date-fns";
import { ja } from "date-fns/locale";
import type { Locale } from "date-fns";
import { logger } from "@/lib/logging";
import { differenceInCalendarDays } from "date-fns";

export const parseDateTime = (dateTimeStr: string | null | undefined): Date | null => {
  if (!dateTimeStr) return null;
  try {
    const isoDateTimePart = dateTimeStr.split(" ")[0];
    return new Date(isoDateTimePart);
  } catch (error) {
    logger.error('Error parsing date', {
      error: error instanceof Error ? error.message : String(error),
      dateTimeStr,
      component: 'DateUtils'
    });
    return null;
  }
};

export const formatDateTime = (
  date: Date | null,
  formatStr: string,
  options?: { locale: Locale },
) => {
  if (!date) return "";
  return format(date, formatStr, { ...options, locale: ja });
};

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatTimeRange(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  const formatOptions: Intl.DateTimeFormatOptions = {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };

  const startStr = start.toLocaleTimeString("ja-JP", formatOptions);
  const endStr = end.toLocaleTimeString("ja-JP", formatOptions);

  return `${startStr}〜${endStr}`;
}

export function formatSlotRange(startsAt: string, endsAt: string): string {
  const start = new Date(startsAt);
  const end = new Date(endsAt);

  const pad = (n: number) => n.toString().padStart(2, "0");

  const startDate = `${start.getFullYear()}年${pad(start.getMonth() + 1)}月${pad(start.getDate())}日`;
  const endDate = `${end.getFullYear()}年${pad(end.getMonth() + 1)}月${pad(end.getDate())}日`;

  const startTime = `${pad(start.getHours())}:${pad(start.getMinutes())}`;
  const endTime = `${pad(end.getHours())}:${pad(end.getMinutes())}`;

  if (startDate === endDate) {
    // 同じ日
    return `${startDate} ${startTime}~${endTime}`;
  } else {
    // 日をまたぐ
    return `${startDate}~${endDate}`;
  }
}

export const getCrossDayLabel = (startDate: Date, endDate: Date) => {
  const diff = differenceInCalendarDays(endDate, startDate);
  if (diff === 0) return null;
  if (diff === 1) return "翌日";
  if (diff === 2) return "翌々日";
  if (diff >= 3) return `${diff}日後`;
  return null;
};
