import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { Locale } from "date-fns";
import clientLogger from "@/lib/logging/client";

export const parseDateTime = (dateTimeStr: string | null | undefined): Date | null => {
  if (!dateTimeStr) return null;
  try {
    const isoDateTimePart = dateTimeStr.split(" ")[0];
    return new Date(isoDateTimePart);
  } catch (error) {
    clientLogger.error('Error parsing date', {
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
