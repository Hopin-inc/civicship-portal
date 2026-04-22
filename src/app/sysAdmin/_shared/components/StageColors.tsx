import React from "react";

const STAGE_DOT_COLORS = {
  habitual: "text-emerald-500",
  regular: "text-amber-500",
  occasional: "text-orange-400",
  latent: "text-slate-300",
} as const;

export const STAGE_BG_COLORS = {
  habitual: "bg-emerald-500",
  regular: "bg-amber-500",
  occasional: "bg-orange-400",
  latent: "bg-slate-200",
} as const;

export type StageKey = keyof typeof STAGE_DOT_COLORS;

export const STAGE_KEYS: readonly StageKey[] = ["habitual", "regular", "occasional", "latent"];

export function StageDot({ stage }: { stage: StageKey }) {
  return <span className={STAGE_DOT_COLORS[stage]}>●</span>;
}
