"use client";

import { useTranslations } from "next-intl";
import { ShieldX } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { REASON_I18N_MAP } from "../constants/ineligibleReason";
import type { VoteGateInfo } from "../types/VoteCastViewModel";

interface VoteEligibilityNoticeProps {
  reason: string | null;
  gate: VoteGateInfo;
}

export function VoteEligibilityNotice({
  reason,
  gate,
}: VoteEligibilityNoticeProps) {
  const t = useTranslations();

  const reasonMessage = (() => {
    if (!reason) return null;
    if (reason === "INSUFFICIENT_ROLE" && gate.requiredRoleLabel) {
      return t("votes.eligibility.reason.INSUFFICIENT_ROLE", {
        role: gate.requiredRoleLabel,
      });
    }
    if (reason === "REQUIRED_NFT_NOT_FOUND" && gate.nftTokenName) {
      return t("votes.eligibility.reason.REQUIRED_NFT_NOT_FOUND", {
        tokenName: gate.nftTokenName,
      });
    }
    const key = REASON_I18N_MAP[reason];
    return key ? t(key) : null;
  })();

  const requirementMessage = (() => {
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
    <Card className="text-center">
      <CardContent className="py-8 space-y-3">
        <ShieldX className="h-8 w-8 text-destructive mx-auto" />
        <p className="text-sm font-medium">{t("votes.eligibility.title")}</p>
        {reasonMessage && (
          <p className="text-xs text-destructive">{reasonMessage}</p>
        )}
        <p className="text-xs text-muted-foreground">{requirementMessage}</p>
      </CardContent>
    </Card>
  );
}
