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

/**
 * 投票一覧行のアクションメニュー。
 * UPCOMING でないフェーズでは編集・削除は disabled で表示される。
 */
export function VoteActionsMenu({ phase, onEdit, onDelete }: VoteActionsMenuProps) {
  const t = useTranslations();
  const isEditable = phase === GqlVoteTopicPhase.Upcoming;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ItemActions
          className="items-start pt-1 cursor-pointer"
          aria-label="アクションメニューを開く"
          onClick={(e) => e.stopPropagation()}
        >
          <Ellipsis className="size-5 text-foreground" />
        </ItemActions>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem
          disabled={!isEditable}
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
          disabled={!isEditable}
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
