"use client";

import { useTranslations } from "next-intl";
import {
  Item,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item";
import type { VoteDetailPowerPolicy } from "../types/VoteDetailView";

interface VoteDetailPowerPolicySectionProps {
  powerPolicy: VoteDetailPowerPolicy;
}

export function VoteDetailPowerPolicySection({
  powerPolicy,
}: VoteDetailPowerPolicySectionProps) {
  const t = useTranslations();

  return (
    <section className="space-y-2">
      <span className="text-sm text-muted-foreground px-1">
        {t("adminVotes.detail.sections.powerPolicy")}
      </span>
      <ItemGroup className="border rounded-lg">
        <Item size="sm">
          <ItemContent>
            <ItemTitle>
              {powerPolicy.type === "flat"
                ? t("adminVotes.form.powerPolicy.type.FLAT")
                : t("adminVotes.form.powerPolicy.type.NFT_COUNT")}
            </ItemTitle>
          </ItemContent>
        </Item>
        {powerPolicy.type === "nftCount" && (
          <>
            <ItemSeparator />
            <Item size="sm">
              <ItemContent>
                <span className="text-sm text-muted-foreground">
                  NFT: {powerPolicy.tokenName ?? "—"}
                </span>
              </ItemContent>
            </Item>
          </>
        )}
      </ItemGroup>
    </section>
  );
}
