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
import { GqlRole, GqlVoteGateType } from "@/types/graphql";
import { VoteTopicFormValues } from "../../types/form";
import { NftTokenOption } from "../../hooks/useNftTokens";

interface GateSectionProps {
  onOpenSheet: () => void;
  nftTokens: NftTokenOption[];
}

const roleLabel = (role: GqlRole, t: (k: string) => string) => {
  switch (role) {
    case GqlRole.Owner:
      return t("adminVotes.form.gate.requiredRole.OWNER");
    case GqlRole.Manager:
      return t("adminVotes.form.gate.requiredRole.MANAGER");
    case GqlRole.Member:
    default:
      return t("adminVotes.form.gate.requiredRole.MEMBER");
  }
};

export function GateSection({ onOpenSheet, nftTokens }: GateSectionProps) {
  const t = useTranslations();
  const { watch, formState } = useFormContext<VoteTopicFormValues>();
  const gate = watch("gate");
  const nftTokenIdError = formState.errors.gate &&
    (formState.errors.gate as { nftTokenId?: { message?: string } }).nftTokenId?.message;

  const summary = (() => {
    if (gate.type === GqlVoteGateType.Membership) {
      return gate.requiredRole
        ? t("adminVotes.form.gate.summary.membershipWithRole", {
            role: roleLabel(gate.requiredRole, t),
          })
        : t("adminVotes.form.gate.summary.membership");
    }
    const token = nftTokens.find((nt) => nt.id === gate.nftTokenId);
    if (token) {
      return t("adminVotes.form.gate.summary.nft", {
        tokenName: token.name ?? token.address,
      });
    }
    return t("adminVotes.form.gate.summary.nftUnselected");
  })();

  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2 px-1">
        <span className="text-sm text-muted-foreground">
          {t("adminVotes.form.gate.label")}
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
          <ItemTitle>{t("adminVotes.form.gate.label")}</ItemTitle>
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
