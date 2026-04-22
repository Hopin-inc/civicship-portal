import React from "react";
import { cn } from "@/lib/utils";

export type SendRateTier = "habitual" | "regular" | "occasional" | "latent";

export function classifySendRate(rate: number): SendRateTier {
  if (rate >= 0.7) return "habitual";
  if (rate >= 0.4) return "regular";
  if (rate > 0) return "occasional";
  return "latent";
}

// StageColors と同じ palette を使う (視覚的に揃える)
const COLOR: Record<SendRateTier, string> = {
  habitual: "text-emerald-600",
  regular: "text-sky-500",
  occasional: "text-violet-500",
  latent: "text-slate-400",
};

type Props = {
  rate: number;
  className?: string;
};

export function SendRateDot({ rate, className }: Props) {
  const tier = classifySendRate(rate);
  return <span className={cn(COLOR[tier], className)} aria-hidden>●</span>;
}
