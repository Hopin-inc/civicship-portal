"use client";

import React from "react";
import { cn } from "@/lib/utils";

type HistoryBarsProps = {
  /**
   * 期間ごとの値。null は「データ範囲外 (description = `dormantCount` /
   * `returnedMembers` / `hubMemberCount` の null と同じ semantic)」で、bar を
   * 描画せず gap として残す。0 は「実データで bar 高さゼロ」として通常描画する
   * (gap と区別する)。
   */
  data: ReadonlyArray<number | null>;
  /** Tailwind text-* color クラス。bar 塗り (currentColor 経由) に使う。 */
  colorClass: string;
  /** 全体幅 (px)。L2 カードの footer で 2 段組想定なら 280-340 が目安。 */
  width?: number;
  height?: number;
  /** bar 同士の隙間 (px)。 */
  gap?: number;
  className?: string;
};

/**
 * 12 期間の縦棒グラフ。Apple Health「概要」ページ風の動的メトリクス用 footer
 * viz として、L2 動的カードに統一導入する。`Sparkline` (line) の bar 版
 * 兄弟で、value-by-value の対比が要る (累積 / 月次差分系) メトリクスに向く。
 *
 * 実装メモ:
 * - 値域は 0 を base、max を全 data の最大値に合わせる (negative は出ない想定)
 * - max == 0 の場合は全 bar が 0 高さで rendering されないので、薄いベースラインを
 *   出して「データはあるが値ゼロ」を伝える
 * - null の bar は描画スキップ、その位置は gap になる
 */
export function HistoryBars({
  data,
  colorClass,
  width = 96,
  height = 24,
  gap = 2,
  className,
}: HistoryBarsProps) {
  if (data.length < 2) return null;

  const numeric = data.filter((v): v is number => v != null);
  const max = numeric.length > 0 ? Math.max(...numeric, 0) : 0;
  const totalGap = gap * (data.length - 1);
  const barWidth = (width - totalGap) / data.length;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden
      className={cn(colorClass, className)}
    >
      {data.map((v, i) => {
        const x = i * (barWidth + gap);
        if (v == null) {
          // null = データ範囲外。空欄 (描画なし) で gap を残す。
          return null;
        }
        // max == 0 のケース: 全 bar が h=0 になるので薄いベースラインを出す
        // (1px) して「値はゼロだがデータはある」状態を表現する。
        const h = max === 0 ? 1 : Math.max(1, (v / max) * height);
        const y = height - h;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barWidth}
            height={h}
            fill="currentColor"
            rx={1}
          />
        );
      })}
    </svg>
  );
}
