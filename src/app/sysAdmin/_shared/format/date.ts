const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

function toJstDate(input: Date | string | number): Date {
  const d = input instanceof Date ? input : new Date(input);
  return new Date(d.getTime() + JST_OFFSET_MS);
}

export function formatJstMonth(input: Date | string | number | null | undefined): string {
  if (input === null || input === undefined) return "-";
  const d = toJstDate(input);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getUTCFullYear()}年${d.getUTCMonth() + 1}月`;
}

export function formatJstMonthShort(input: Date | string | number | null | undefined): string {
  if (input === null || input === undefined) return "-";
  const d = toJstDate(input);
  if (Number.isNaN(d.getTime())) return "-";
  return `${String(d.getUTCFullYear()).slice(2)}/${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function formatIsoWeek(input: Date | string | number | null | undefined): string {
  if (input === null || input === undefined) return "-";
  const d = toJstDate(input);
  if (Number.isNaN(d.getTime())) return "-";
  const target = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNr = (target.getUTCDay() + 6) % 7;
  target.setUTCDate(target.getUTCDate() - dayNr + 3);
  const firstThursday = new Date(Date.UTC(target.getUTCFullYear(), 0, 4));
  const firstDayNr = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstDayNr + 3);
  const weekNr =
    1 + Math.round((target.getTime() - firstThursday.getTime()) / (7 * 24 * 60 * 60 * 1000));
  return `${target.getUTCFullYear()}-W${String(weekNr).padStart(2, "0")}`;
}

export function formatJstDate(input: Date | string | number | null | undefined): string {
  if (input === null || input === undefined) return "-";
  const d = toJstDate(input);
  if (Number.isNaN(d.getTime())) return "-";
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(
    d.getUTCDate(),
  ).padStart(2, "0")}`;
}

export function toIsoDate(input: Date | string | number): string {
  const d = input instanceof Date ? input : new Date(input);
  return d.toISOString();
}
