"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";
import { AppLink } from "@/lib/navigation";
import { Item, ItemContent, ItemFooter, ItemTitle } from "@/components/ui/item";
import { cn } from "@/lib/utils";
import { VotePhaseBadge } from "@/shared/vote/components/VotePhaseBadge";
import { formatVotePeriod } from "@/shared/vote/utils/formatVotePeriod";
import type { UserVoteListItem as UserVoteListItemModel } from "../types/UserVoteListItem";

interface UserVoteListItemProps {
  item: UserVoteListItemModel;
}

export function UserVoteListItem({ item }: UserVoteListItemProps) {
  const t = useTranslations();

  return (
    <Item className={cn("items-start", !item.isEligible && "opacity-60")}>
      <AppLink
        href={`/votes/${item.id}`}
        className="flex flex-1 flex-col min-w-0 gap-2"
      >
        <ItemContent className="space-y-2">
          <VotePhaseBadge phase={item.phase} className="w-fit" />
          <ItemTitle className="font-bold text-base leading-snug line-clamp-2">
            {item.title}
          </ItemTitle>
          <div className="text-xs text-muted-foreground">
            {formatVotePeriod(item.startsAt, item.endsAt)}
          </div>
        </ItemContent>

        <ItemFooter className="mt-1">
          {item.myBallotLabel ? (
            <span className="flex items-center gap-1 text-xs text-primary">
              <Check className="h-3 w-3" />
              {t("votes.list.votedFor", { label: item.myBallotLabel })}
            </span>
          ) : !item.isEligible ? (
            <span className="text-xs text-muted-foreground">
              {t("votes.list.notEligible")}
            </span>
          ) : null}
        </ItemFooter>
      </AppLink>
    </Item>
  );
}
