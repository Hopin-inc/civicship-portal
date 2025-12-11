"use client";

import { Ellipsis } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ItemActions } from "@/components/ui/item";
import { GqlPublishStatus } from "@/types/graphql";

type OpportunityActionsMenuProps = {
  status: GqlPublishStatus;
  onEdit: () => void;
  onBackToDraft?: () => void;
  onCopyUrl?: () => void;
  onDeleteDraft?: () => void;
};

export function OpportunityActionsMenu({
  status,
  onEdit,
  onBackToDraft,
  onCopyUrl,
  onDeleteDraft,
}: OpportunityActionsMenuProps) {
  const isPublicOrInternal =
    status === GqlPublishStatus.Public || status === GqlPublishStatus.CommunityInternal;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ItemActions className="items-start pt-1 cursor-pointer">
          <Ellipsis className="size-5 text-foreground" />
        </ItemActions>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-40">
        {/* 共通: 編集 */}
        <DropdownMenuItem
          onSelect={(event) => {
            event.preventDefault();
            onEdit();
          }}
        >
          編集
        </DropdownMenuItem>

        {isPublicOrInternal && (
          <>
            {onBackToDraft && (
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  onBackToDraft();
                }}
              >
                下書きに戻す
              </DropdownMenuItem>
            )}

            <DropdownMenuSeparator />

            {onCopyUrl && (
              <DropdownMenuItem
                onSelect={(event) => {
                  event.preventDefault();
                  onCopyUrl();
                }}
              >
                URLをコピー
              </DropdownMenuItem>
            )}
          </>
        )}

        {status === GqlPublishStatus.Private && (
          <>
            <DropdownMenuSeparator />

            {onDeleteDraft && (
              <DropdownMenuItem
                className="text-destructive"
                onSelect={(event) => {
                  event.preventDefault();
                  onDeleteDraft();
                }}
              >
                下書きを削除
              </DropdownMenuItem>
            )}
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
