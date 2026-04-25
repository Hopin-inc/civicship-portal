/**
 * Period preset の値型 + helper。L1 baseline では UI を持たない (period select は
 * L2 詳細で導入予定) ため、定数と純関数だけを切り出して L1 hooks から参照する。
 */

export type PeriodPreset =
  | "thisMonth"
  | "lastMonth"
  | "last3Months"
  | "last6Months"
  | "last1Year"
  | "allTime";

export const DEFAULT_PERIOD: PeriodPreset = "last3Months";

type Option = {
  value: PeriodPreset;
  label: string;
  windowMonths: number;
  /** `asOf` を計算する関数 (`today` = サーバー現在時刻)。 */
  asOfOffset: "today" | "lastMonthEnd";
};

export const PERIOD_OPTIONS: readonly Option[] = [
  { value: "thisMonth", label: "今月", windowMonths: 1, asOfOffset: "today" },
  { value: "lastMonth", label: "先月", windowMonths: 1, asOfOffset: "lastMonthEnd" },
  { value: "last3Months", label: "直近3ヶ月", windowMonths: 3, asOfOffset: "today" },
  { value: "last6Months", label: "直近半年", windowMonths: 6, asOfOffset: "today" },
  { value: "last1Year", label: "直近1年", windowMonths: 12, asOfOffset: "today" },
  { value: "allTime", label: "全期間", windowMonths: 36, asOfOffset: "today" },
] as const;

/**
 * PeriodPreset から (asOf ISO | null, windowMonths) への変換。
 * - `today` → asOf=null (API 側でサーバー現在時刻を使う)
 * - `lastMonthEnd` → 先月末日 23:59:59 JST の ISO
 */
export function resolvePeriodToInput(preset: PeriodPreset): {
  asOf: string | null;
  windowMonths: number;
} {
  const opt = PERIOD_OPTIONS.find((o) => o.value === preset) ?? PERIOD_OPTIONS[2]!;
  if (opt.asOfOffset === "today") {
    return { asOf: null, windowMonths: opt.windowMonths };
  }
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const lastMonthEnd = new Date(
    Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth(), 0, 23 - 9, 59, 59),
  );
  return { asOf: lastMonthEnd.toISOString(), windowMonths: opt.windowMonths };
}
