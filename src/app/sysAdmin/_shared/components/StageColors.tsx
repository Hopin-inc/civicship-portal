import React from "react";

// 情報階層: 「定着 (habitual) だけを色で強調し、それ以外は muted な slate で背景扱い」。
// 達成度合いを一目で読ませるための二分軸 (定着 vs それ以外)。
// regular/occasional/latent は slate の濃淡で識別するが、admin 視線では
// 全部「伸びしろ」として同じ扱い。
const STAGE_DOT_COLORS = {
  habitual: "text-emerald-600",
  regular: "text-slate-500",
  occasional: "text-slate-400",
  latent: "text-slate-400",
} as const;

export const STAGE_BG_COLORS = {
  habitual: "bg-emerald-600",
  regular: "bg-slate-400",
  occasional: "bg-slate-300",
  latent: "bg-slate-200",
} as const;

export type StageKey = keyof typeof STAGE_DOT_COLORS;

export const STAGE_KEYS: readonly StageKey[] = ["habitual", "regular", "occasional", "latent"];

export function StageDot({ stage }: { stage: StageKey }) {
  return <span className={STAGE_DOT_COLORS[stage]}>●</span>;
}
