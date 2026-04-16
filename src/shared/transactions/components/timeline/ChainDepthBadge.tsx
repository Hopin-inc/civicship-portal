"use client";

import { Link2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ChainDepthBadgeProps {
  depth?: number | null;
}

/**
 * ポイントの経路（chain）の参加人数を示す小さなバッジ。
 * depth はステップ数（エッジ数）で、参加人数は depth + 1。
 * depth が null / undefined / 1 以下のときは何も描画しない（呼び出し側でガード不要）。
 */
export const ChainDepthBadge = ({ depth }: ChainDepthBadgeProps) => {
  const t = useTranslations();

  if (!depth || depth < 2) return null;

  const participants = depth + 1;
  const label = t("transactions.chain.badgeLabel", { count: participants });

  return (
    <span
      title={label}
      aria-label={label}
      className="shrink-0 inline-flex items-center gap-0.5 rounded-full border border-muted-foreground/30 px-1.5 py-px text-[10px] leading-none text-muted-foreground"
    >
      <Link2 className="w-2.5 h-2.5" strokeWidth={2} />
      <span className="tabular-nums">{participants}</span>
    </span>
  );
};
