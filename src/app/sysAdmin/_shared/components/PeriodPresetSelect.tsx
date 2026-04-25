"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

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
  /** `asOf` を計算する関数 (null = 今日)。API 未指定時は今日を使うので null で OK */
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
  // lastMonthEnd: 先月末日 23:59:59 JST
  const now = new Date();
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const lastMonthEnd = new Date(
    Date.UTC(jst.getUTCFullYear(), jst.getUTCMonth(), 0, 23 - 9, 59, 59),
  );
  return { asOf: lastMonthEnd.toISOString(), windowMonths: opt.windowMonths };
}

type Props = {
  value: PeriodPreset;
  onChange: (next: PeriodPreset) => void;
  disabled?: boolean;
  id?: string;
  className?: string;
};

/**
 * shadcn Select を使った期間 dropdown。ラベルは表示しない
 * (dropdown 自体で何を選ぶか明確なため)。
 */
export function PeriodPresetSelect({
  value,
  onChange,
  disabled,
  id = "period-preset",
  className,
}: Props) {
  return (
    <Select
      value={value}
      onValueChange={(v) => onChange(v as PeriodPreset)}
      disabled={disabled}
    >
      <SelectTrigger id={id} className={cn("h-8 w-28 text-xs", className)} aria-label="集計期間">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PERIOD_OPTIONS.map((opt) => (
          <SelectItem key={opt.value} value={opt.value} className="text-xs">
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
