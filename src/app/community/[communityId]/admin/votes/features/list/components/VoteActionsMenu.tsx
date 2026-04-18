"use client";

import { Ellipsis } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ItemActions } from "@/components/ui/item";
import { GqlVoteTopicPhase } from "@/types/graphql";

interface VoteActionsMenuProps {
  phase: GqlVoteTopicPhase;
  onEdit: () => void;
  onDelete: () => void;
}

export function VoteActionsMenu({ phase, onEdit, onDelete }: VoteActionsMenuProps) {
  const t = useTranslations();
  const isEditable = phase === GqlVoteTopicPhase.Upcoming;

  if (!isEditable) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ItemActions
          className="items-start pt-1 cursor-pointer"
          aria-label={t("adminVotes.list.actions.openMenu")}
          onClick={(e) => e.stopPropagation()}
        >
          <Ellipsis className="size-5 text-foreground" />
        </ItemActions>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            onEdit();
          }}
        >
          {t("adminVotes.list.actions.edit")}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          className="text-destructive"
          onSelect={(event) => {
            event.preventDefault();
            onDelete();
          }}
        >
          {t("adminVotes.list.actions.delete")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
