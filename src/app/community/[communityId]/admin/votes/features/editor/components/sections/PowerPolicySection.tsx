"use client";

import { useFormContext } from "react-hook-form";
import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import { GqlVotePowerPolicyType } from "@/types/graphql";
import { VoteTopicFormValues } from "../../types/form";
import { NftTokenOption } from "../../hooks/useNftTokens";

interface PowerPolicySectionProps {
  onOpenSheet: () => void;
  nftTokens: NftTokenOption[];
}

export function PowerPolicySection({ onOpenSheet, nftTokens }: PowerPolicySectionProps) {
  const t = useTranslations();
  const { watch, formState } = useFormContext<VoteTopicFormValues>();
  const powerPolicy = watch("powerPolicy");
  const nftTokenIdError = formState.errors.powerPolicy &&
    (formState.errors.powerPolicy as { nftTokenId?: { message?: string } }).nftTokenId?.message;

  const summary = (() => {
    if (powerPolicy.type === GqlVotePowerPolicyType.Flat) {
      return t("adminVotes.form.powerPolicy.summary.flat");
    }
    const token = nftTokens.find((nt) => nt.id === powerPolicy.nftTokenId);
    if (token) {
      return t("adminVotes.form.powerPolicy.summary.nftCount", {
        tokenName: token.name ?? token.address,
      });
    }
    return t("adminVotes.form.powerPolicy.summary.nftCountUnselected");
  })();

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm text-muted-foreground">
          {t("adminVotes.form.powerPolicy.label")}
        </span>
        <span className="text-primary text-xs font-bold bg-primary-foreground px-1 py-0.5 rounded">
          必須
        </span>
      </div>
      <Item
        size="sm"
        variant="outline"
        role="button"
        tabIndex={0}
        onClick={onOpenSheet}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            onOpenSheet();
          }
        }}
        className="cursor-pointer"
      >
        <ItemContent>
          <ItemTitle>{t("adminVotes.form.powerPolicy.label")}</ItemTitle>
          <ItemDescription>{summary}</ItemDescription>
        </ItemContent>
        <ItemActions>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </ItemActions>
      </Item>
      {nftTokenIdError && (
        <p className="text-xs text-destructive px-1">{nftTokenIdError}</p>
      )}
    </section>
  );
}
