import React from "react";
import { cn } from "@/lib/utils";

export type SendRateTier = "habitual" | "regular" | "occasional" | "latent";

export const DEFAULT_SEND_RATE_TIER1 = 0.7;
export const DEFAULT_SEND_RATE_TIER2 = 0.4;

/**
 * SendRate を 4 ステージに分類。`tier1` / `tier2` は SettingsDrawer で
 * ユーザーが変えられるため、呼び出し側で都度渡せるようにしている。
 * 省略時は backend default と揃えた 0.7 / 0.4 を使う。
 */
export function classifySendRate(
  rate: number,
  tier1: number = DEFAULT_SEND_RATE_TIER1,
  tier2: number = DEFAULT_SEND_RATE_TIER2,
): SendRateTier {
  if (rate >= tier1) return "habitual";
  if (rate >= tier2) return "regular";
  if (rate > 0) return "occasional";
  return "latent";
}

// StageColors と同じ palette を使う (視覚的に揃える)。
// 習慣化だけを色で強調、他は slate の濃淡で muted。
const COLOR: Record<SendRateTier, string> = {
  habitual: "text-emerald-600",
  regular: "text-slate-500",
  occasional: "text-slate-400",
  latent: "text-slate-400",
};

type Props = {
  rate: number;
  tier1?: number;
  tier2?: number;
  className?: string;
};

export function SendRateDot({ rate, tier1, tier2, className }: Props) {
  const tier = classifySendRate(rate, tier1, tier2);
  return <span className={cn(COLOR[tier], className)} aria-hidden>●</span>;
}
