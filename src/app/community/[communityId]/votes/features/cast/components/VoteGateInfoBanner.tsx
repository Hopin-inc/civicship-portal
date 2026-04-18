"use client";

import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import type { VoteGateInfo } from "../types/VoteCastViewModel";

interface VoteGateInfoBannerProps {
  gate: VoteGateInfo;
}

export function VoteGateInfoBanner({ gate }: VoteGateInfoBannerProps) {
  const t = useTranslations();

  const message = (() => {
    if (gate.type === "nft" && gate.nftTokenName) {
      return t("votes.eligibility.requirement.nft", {
        tokenName: gate.nftTokenName,
      });
    }
    if (gate.type === "membership" && gate.requiredRoleLabel) {
      return t("votes.eligibility.requirement.membershipWithRole", {
        role: gate.requiredRoleLabel,
      });
    }
    return t("votes.eligibility.requirement.membership");
  })();

  return (
    <div className="flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-2">
      <ShieldCheck className="h-4 w-4 shrink-0 text-muted-foreground" />
      <span className="text-xs text-muted-foreground">{message}</span>
    </div>
  );
}
