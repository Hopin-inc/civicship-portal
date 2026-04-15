"use client";

import { Link2 } from "lucide-react";
import { useTranslations } from "next-intl";

interface ChainDepthBadgeProps {
  depth: number;
}

/**
 * ポイントの経路（chain）の深さを示す小さなバッジ。
 * depth >= 2 のときだけ表示する（1 は単発なので意味がないため）。
 */
export const ChainDepthBadge = ({ depth }: ChainDepthBadgeProps) => {
  const t = useTranslations();

  if (depth < 2) return null;

  return (
    <span
      title={t("transactions.chain.badgeLabel", { count: depth })}
      aria-label={t("transactions.chain.badgeLabel", { count: depth })}
      className="shrink-0 inline-flex items-center gap-0.5 rounded-full border border-muted-foreground/30 px-1.5 py-px text-[10px] leading-none text-muted-foreground"
    >
      <Link2 className="w-2.5 h-2.5" strokeWidth={2} />
      <span className="tabular-nums">{depth}</span>
    </span>
  );
};
