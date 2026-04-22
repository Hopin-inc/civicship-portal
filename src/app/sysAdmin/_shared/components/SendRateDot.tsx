import React from "react";
import { cn } from "@/lib/utils";

export type SendRateTier = "habitual" | "regular" | "occasional" | "latent";

export function classifySendRate(rate: number): SendRateTier {
  if (rate >= 0.7) return "habitual";
  if (rate >= 0.4) return "regular";
  if (rate > 0) return "occasional";
  return "latent";
}

const COLOR: Record<SendRateTier, string> = {
  habitual: "text-emerald-500",
  regular: "text-amber-500",
  occasional: "text-orange-400",
  latent: "text-slate-300",
};

type Props = {
  rate: number;
  className?: string;
};

export function SendRateDot({ rate, className }: Props) {
  const tier = classifySendRate(rate);
  return <span className={cn(COLOR[tier], className)} aria-hidden>●</span>;
}
