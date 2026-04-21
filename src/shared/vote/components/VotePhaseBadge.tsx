"use client";

import type { ComponentProps } from "react";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { GqlVoteTopicPhase } from "@/types/graphql";
import { cn } from "@/lib/utils";

interface VotePhaseBadgeProps {
  phase: GqlVoteTopicPhase;
  className?: string;
}

const VARIANT_BY_PHASE: Record<
  GqlVoteTopicPhase,
  ComponentProps<typeof Badge>["variant"]
> = {
  UPCOMING: "secondary",
  OPEN: "success",
  CLOSED: "outline",
};

const I18N_KEY_BY_PHASE: Record<GqlVoteTopicPhase, string> = {
  UPCOMING: "adminVotes.phase.UPCOMING",
  OPEN: "adminVotes.phase.OPEN",
  CLOSED: "adminVotes.phase.CLOSED",
};

/**
 * 投票フェーズを表すバッジ。
 * UPCOMING（開始前）/ OPEN（開催中）/ CLOSED（終了）を色分けで表示する。
 */
export const VotePhaseBadge = ({ phase, className }: VotePhaseBadgeProps) => {
  const t = useTranslations();
  return (
    <Badge variant={VARIANT_BY_PHASE[phase]} size="sm" className={cn("shrink-0", className)}>
      {t(I18N_KEY_BY_PHASE[phase])}
    </Badge>
  );
};
