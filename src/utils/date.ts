import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { Locale } from "date-fns";
import { logger } from "@/lib/logging";
import { differenceInCalendarDays } from "date-fns";
import dayjs from "dayjs";

const YEAR_FMT = "YYYY年";
const MONTH_DATE_FMT = "M月D日(ddd)";
const TIME_FMT = "H:mm";
const FULL_FMT = `${YEAR_FMT}${MONTH_DATE_FMT} ${TIME_FMT}`;
const DATE_FMT = `${YEAR_FMT}${MONTH_DATE_FMT}`;

export const parseDateTime = (dateTimeStr: string | null | undefined): Date | null => {
  if (!dateTimeStr) return null;
  try {
    const isoDateTimePart = dateTimeStr.split(" ")[0];
    return new Date(isoDateTimePart);
  } catch (error) {
    logger.warn('Error parsing date', {
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

export const displayDatetime = (date: Date | string | null | undefined, format: string = FULL_FMT, nullString: string = "未設定") => {
  if (!date) return nullString;
  return dayjs(date).format(format);
};

export const displayDuration = (start: Date | string, end?: Date | string, multiline: boolean = false) => {
  const dStart = dayjs(start);
  const dEnd = dayjs(end);
  
  if (!end) return displayDatetime(start, FULL_FMT);
  
  if (dStart.isSame(dEnd, "date")) {
    // 同じ日付の場合
    if (multiline) {
      // 同じ日付でmultilineがtrueの場合は2行表示
      return `${dStart.format(DATE_FMT)}\n${dStart.format(TIME_FMT)} 〜 ${dEnd.format(TIME_FMT)}`;
    } else {
      // 同じ日付でmultilineがfalseの場合は1行表示
      return `${dStart.format(FULL_FMT)}〜${dEnd.format(TIME_FMT)}`;
    }
  } else if (multiline) {
    // 日付を跨ぐ場合でmultilineがtrueの場合は2行表示
    return `${dStart.format(FULL_FMT)} 〜\n${dEnd.format(FULL_FMT)}`;
  } else {
    // 日付を跨ぐ場合でmultilineがfalseの場合は1行表示
    if (dStart.isSame(dEnd, "year")) {
      return `${dStart.format(FULL_FMT)} 〜 ${dEnd.format(`${MONTH_DATE_FMT} ${TIME_FMT}`)}`;
    } else {
      return `${dStart.format(FULL_FMT)} 〜 ${dEnd.format(FULL_FMT)}`;
    }
  }
};