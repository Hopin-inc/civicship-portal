// src/app/admin/opportunities/utils/dateFormat.ts

/**
 * ISO 8601形式の日付文字列を YYYY-MM-DD 形式にフォーマット
 * @param isoDateString ISO 8601形式の日付文字列
 * @returns YYYY-MM-DD 形式の文字列、または空文字列
 */
export function formatISODate(isoDateString: string | null | undefined): string {
  if (!isoDateString) return "";

  try {
    return isoDateString.split("T")[0];
  } catch {
    return "";
  }
}

/**
 * ISO 8601形式の日付文字列を相対時間表示に変換
 * @param isoDateString ISO 8601形式の日付文字列
 * @returns 「○日前」形式の文字列、またはYYYY-MM-DD
 */
export function formatRelativeDate(isoDateString: string | null | undefined): string {
  if (!isoDateString) return "";

  try {
    const date = new Date(isoDateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "今日";
    if (diffDays === 1) return "昨日";
    if (diffDays < 7) return `${diffDays}日前`;

    return formatISODate(isoDateString);
  } catch {
    return formatISODate(isoDateString);
  }
}
