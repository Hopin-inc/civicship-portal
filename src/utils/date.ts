import { format, parseISO, startOfDay, isAfter, addDays } from "date-fns";
import { ja } from "date-fns/locale";
import type { Locale } from "date-fns";
import { logger } from "@/lib/logging";
import { toZonedTime, formatInTimeZone } from "date-fns-tz";

// Constants
export const JST_TIMEZONE = "Asia/Tokyo";

// Timezone utilities
export const toJST = (date: Date): Date => {
  return toZonedTime(date, JST_TIMEZONE);
};

export const formatInJST = (date: Date, formatStr: string): string => {
  return formatInTimeZone(date, JST_TIMEZONE, formatStr);
};

export const getJSTDateString = (date: Date): string => {
  return formatInTimeZone(date, JST_TIMEZONE, "yyyy-MM-dd");
};

export const parseJSTDateString = (dateStr: string, timeStr: string = "00:00:00"): Date => {
  return parseISO(`${dateStr}T${timeStr}`);
};

export const getStartOfDayInJST = (date: Date): Date => {
  const dateInJST = formatInJST(date, "yyyy-MM-dd");
  return parseISO(`${dateInJST}T00:00:00`);
};

export const getTomorrowStartInJST = (): Date => {
  const now = new Date();
  const todayInJST = getJSTDateString(now);
  const tomorrow = parseISO(`${todayInJST}T00:00:00`);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

export const isAfterInJST = (date: Date, dateToCompare: Date): boolean => {
  const dateInJST = toJST(date);
  const dateToCompareInJST = toJST(dateToCompare);
  return isAfter(dateInJST, dateToCompareInJST);
};

export const addDaysInJST = (date: Date, amount: number): Date => {
  const dateInJST = toJST(date);
  return addDays(dateInJST, amount);
};

export const parseDateTime = (dateTimeStr: string | null | undefined): Date | null => {
  if (!dateTimeStr) return null;
  try {
    const isoDateTimePart = dateTimeStr.split(" ")[0];
    return new Date(isoDateTimePart);
  } catch (error) {
    logger.error("Error parsing date", {
      error: error instanceof Error ? error.message : String(error),
      dateTimeStr,
      component: "DateUtils",
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
