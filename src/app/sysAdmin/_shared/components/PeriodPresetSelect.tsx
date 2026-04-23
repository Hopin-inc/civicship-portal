"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  { value: "last3Months", label: "3ヶ月", windowMonths: 3, asOfOffset: "today" },
  { value: "last6Months", label: "半年", windowMonths: 6, asOfOffset: "today" },
  { value: "last1Year", label: "1年", windowMonths: 12, asOfOffset: "today" },
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
  // lastMonthEnd: 先月の末日 23:59:59 JST
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
  className?: string;
};

/**
 * 横並びの segmented button group。mobile では flex-wrap で自然に折り返す。
 */
export function PeriodPresetSelect({ value, onChange, disabled, className }: Props) {
  return (
    <div
      role="radiogroup"
      aria-label="集計期間"
      className={cn("inline-flex flex-wrap gap-1 rounded-md border p-0.5", className)}
    >
      {PERIOD_OPTIONS.map((opt) => {
        const selected = opt.value === value;
        return (
          <Button
            key={opt.value}
            type="button"
            role="radio"
            aria-checked={selected}
            variant={selected ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "h-7 rounded-sm px-2.5 text-xs font-medium",
              selected && "shadow-none",
            )}
            onClick={() => onChange(opt.value)}
            disabled={disabled}
          >
            {opt.label}
          </Button>
        );
      })}
    </div>
  );
}
