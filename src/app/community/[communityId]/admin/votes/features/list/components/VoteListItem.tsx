"use client";

import { useTranslations } from "next-intl";
import { AppLink } from "@/lib/navigation";
import { Item, ItemContent, ItemFooter, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { GqlRole } from "@/types/graphql";
import { VotePhaseBadge } from "@/shared/vote/components/VotePhaseBadge";
import { formatVotePeriod } from "@/shared/vote/utils/formatVotePeriod";
import type { VoteListItem as VoteListItemModel } from "../types/VoteListItem";
import { VoteActionsMenu } from "./VoteActionsMenu";

interface VoteListItemProps {
  item: VoteListItemModel;
  onEdit: () => void;
  onDelete: () => void;
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

function gateSummaryText(
  summary: VoteListItemModel["gateSummary"],
  t: Translator,
): string {
  if (summary.type === "nft") {
    return summary.tokenName ?? "NFT";
  }
  return roleLabel(summary.requiredRole, t);
}

function powerPolicySummaryText(
  summary: VoteListItemModel["powerPolicySummary"],
  t: Translator,
): string {
  if (summary.type === "flat") {
    return t("adminVotes.form.powerPolicy.type.FLAT");
  }
  return summary.tokenName
    ? `NFT: ${summary.tokenName}`
    : t("adminVotes.form.powerPolicy.type.NFT_COUNT");
}

export function VoteListItem({ item, onEdit, onDelete }: VoteListItemProps) {
  const t = useTranslations();

  return (
    <Item className="items-start">
      <AppLink
        href={`/admin/votes/${item.id}`}
        className="flex flex-1 flex-col min-w-0 gap-2"
      >
        <ItemContent className="space-y-2">
          <div className="flex items-start gap-2">
            <ItemTitle className={cn("font-bold text-base leading-snug", "line-clamp-2 flex-1")}>
              {item.title}
            </ItemTitle>
            <VotePhaseBadge phase={item.phase} />
          </div>

          <div className="text-xs text-muted-foreground">
            {formatVotePeriod(item.startsAt, item.endsAt)}
          </div>
        </ItemContent>

        <ItemFooter className="mt-1">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="truncate max-w-[160px]">
              {gateSummaryText(item.gateSummary, t)}
            </span>
            <span className="truncate max-w-[160px]">
              {powerPolicySummaryText(item.powerPolicySummary, t)}
            </span>
            <span>
              {t("adminVotes.list.optionCount", { count: item.optionCount })}
            </span>
          </div>
        </ItemFooter>
      </AppLink>

      <VoteActionsMenu
        phase={item.phase}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Item>
  );
}
