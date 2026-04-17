"use client";

import { useTranslations } from "next-intl";
import { GqlRole } from "@/types/graphql";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import type {
  VoteDetailGate,
  VoteDetailPowerPolicy,
} from "../types/VoteDetailView";

interface VoteDetailRulesSectionProps {
  gate: VoteDetailGate;
  powerPolicy: VoteDetailPowerPolicy;
}

type Translator = ReturnType<typeof useTranslations>;

function roleLabel(role: GqlRole, t: Translator): string {
  switch (role) {
    case GqlRole.Owner:
      return t("adminVotes.form.gate.requiredRole.OWNER");
    case GqlRole.Manager:
      return t("adminVotes.form.gate.requiredRole.MANAGER");
    case GqlRole.Member:
    default:
      return t("adminVotes.form.gate.requiredRole.MEMBER");
  }
}

export function VoteDetailRulesSection({
  gate,
  powerPolicy,
}: VoteDetailRulesSectionProps) {
  const t = useTranslations();

  return (
    <section className="space-y-2">
      <span className="text-sm text-muted-foreground px-1">
        {t("adminVotes.form.votingRules.label")}
      </span>
      <ItemGroup className="border rounded-lg">
        {/* 投票資格タイプ */}
        <Item size="sm">
          <ItemContent>
            <ItemTitle>
              {gate.type === "membership"
                ? t("adminVotes.form.gate.type.MEMBERSHIP")
                : t("adminVotes.form.gate.type.NFT.inline")}
            </ItemTitle>
          </ItemContent>
        </Item>

        <ItemSeparator />

        {/* MEMBERSHIP: ロール */}
        {gate.type === "membership" && (
          <Item size="sm">
            <ItemContent>
              <span className="text-sm text-muted-foreground">
                {t("adminVotes.form.gate.requiredRole.label")}:{" "}
                {roleLabel(gate.requiredRole, t)}
              </span>
            </ItemContent>
          </Item>
        )}

        {/* NFT: トークン名 + 票の重み */}
        {gate.type === "nft" && (
          <>
            <Item size="sm">
              <ItemContent>
                <span className="text-sm text-muted-foreground">
                  {t("adminVotes.form.gate.nftToken.label")}: {gate.tokenName ?? "—"}
                </span>
              </ItemContent>
            </Item>

            <ItemSeparator />

            <Item size="sm">
              <ItemContent>
                <span className="text-sm text-muted-foreground">
                  {t("adminVotes.form.powerPolicy.label")}:{" "}
                  {powerPolicy.type === "flat"
                    ? t("adminVotes.form.powerPolicy.type.FLAT")
                    : t("adminVotes.form.powerPolicy.type.NFT_COUNT")}
                </span>
              </ItemContent>
            </Item>
          </>
        )}
      </ItemGroup>
    </section>
  );
}
