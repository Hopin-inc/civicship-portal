import React from "react";

// カテゴリカルな 4 色。amber/orange の近似を避け、各ステージが 375px 幅の
// 積み棒でも視覚的に区別できるよう distinct hues を採用。WCAG AA (3:1 以上)
// を white 背景に対して意識 — latent は slate-400 まで暗くして薄過ぎる問題を
// 回避 (旧 slate-300 は 1.5:1 で fail)。
const STAGE_DOT_COLORS = {
  habitual: "text-emerald-600",
  regular: "text-sky-500",
  occasional: "text-violet-500",
  latent: "text-slate-400",
} as const;

export const STAGE_BG_COLORS = {
  habitual: "bg-emerald-600",
  regular: "bg-sky-500",
  occasional: "bg-violet-500",
  latent: "bg-slate-300",
} as const;

export type StageKey = keyof typeof STAGE_DOT_COLORS;

export const STAGE_KEYS: readonly StageKey[] = ["habitual", "regular", "occasional", "latent"];

export function StageDot({ stage }: { stage: StageKey }) {
  return <span className={STAGE_DOT_COLORS[stage]}>●</span>;
}
