"use client";

import React from "react";
import { Info } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { METRIC_DEFINITIONS, type MetricKey } from "./MetricDefinitions";

type Props = {
  /** MetricDefinitions の key。対応するエントリが無い場合は何も描画しない。 */
  metricKey: MetricKey;
  className?: string;
};

/**
 * カード header に置く小さな info icon。タップで該当指標の定義 (formula /
 * note / range) を Popover で開く。中央集約の用語ダイアログ (旧
 * MetricGlossary) を撤去して、各カードに直接マウントする in-context な
 * 解説 UI に置き換える。
 *
 * 設計判断:
 * - 「全体の用語一覧」を持たない代わりに各カードに ? icon を置くことで、
 *   読み手が気になった瞬間にその場で定義を確認できる
 * - icon は h-3.5 (= 14px) で hero 数字と競合しない大きさ
 * - Popover content は w-72 (= 288px) で formula + note + range を読める量
 */
export function MetricInfoButton({ metricKey, className }: Props) {
  const def = METRIC_DEFINITIONS[metricKey];
  if (!def) return null;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label={`${def.title} の定義を見る`}
          className={cn(
            "inline-flex items-center justify-center rounded-full text-muted-foreground/60 transition-colors hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            className,
          )}
        >
          <Info className="h-3.5 w-3.5" aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={6}
        className="w-72 text-xs text-muted-foreground"
      >
        <div className="flex flex-col gap-1.5">
          <h4 className="text-xs font-medium text-foreground">{def.title}</h4>
          <p>
            <span className="mr-1 text-muted-foreground/60">計算式:</span>
            {def.formula}
          </p>
          {def.note && (
            <p>
              <span className="mr-1 text-muted-foreground/60">補足:</span>
              {def.note}
            </p>
          )}
          {def.range && (
            <p>
              <span className="mr-1 text-muted-foreground/60">範囲:</span>
              {def.range}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
