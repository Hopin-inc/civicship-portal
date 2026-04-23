import React from "react";

// 情報階層: 「達成ステージ (習慣化/定期) には色を割り当てて視線を引き、
// 受動ステージ (散発/潜在) は muted な slate で背景扱い」。
// 4 色を distinct hue で分けるより「達成 vs 未達」の二分軸が admin の
// 読みやすさに直結するため、occasional/latent は slate 系に統一した。
const STAGE_DOT_COLORS = {
  habitual: "text-emerald-600",
  regular: "text-sky-500",
  occasional: "text-slate-400",
  latent: "text-slate-400",
} as const;

export const STAGE_BG_COLORS = {
  habitual: "bg-emerald-600",
  regular: "bg-sky-500",
  occasional: "bg-slate-300",
  latent: "bg-slate-200",
} as const;

export type StageKey = keyof typeof STAGE_DOT_COLORS;

export const STAGE_KEYS: readonly StageKey[] = ["habitual", "regular", "occasional", "latent"];

export function StageDot({ stage }: { stage: StageKey }) {
  return <span className={STAGE_DOT_COLORS[stage]}>●</span>;
}
