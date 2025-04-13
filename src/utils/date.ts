import { format } from "date-fns";
import { ja } from "date-fns/locale";
import type { Locale } from "date-fns";

export const parseDateTime = (dateTimeStr: string | null | undefined): Date | null => {
  if (!dateTimeStr) return null;
  try {
    const isoDateTimePart = dateTimeStr.split(' ')[0];
    return new Date(isoDateTimePart);
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
};

export const formatDateTime = (date: Date | null, formatStr: string, options?: { locale: Locale }) => {
  if (!date) return '';
  return format(date, formatStr, { ...options, locale: ja });
};

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}分`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) {
    return `${hours}時間`;
  }
  return `${hours}時間${remainingMinutes}分`;
}
