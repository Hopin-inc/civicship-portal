"use client";

import { Item, ItemContent, ItemFooter, ItemTitle } from "@/components/ui/item";
import { OpportunityListItem } from "../types/OpportunityListItem";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { OpportunityActionsMenu } from "./OpportunityActionsMenu";
import { useOpportunityActions } from "../hooks/useOpportunityActions";
import { formatISODateTime } from "../../shared/utils/dateFormat";
import { PUBLISH_STATUS_COLORS } from "../constants/opportunity";

interface OpportunityItemProps {
  opportunity: OpportunityListItem;
  refetch?: () => void;
}

export function OpportunityItem({ opportunity, refetch }: OpportunityItemProps) {
  const hasImage = opportunity.images.length > 0;
  const imageUrl = hasImage ? opportunity.images[0] : null;

  // アクションフックを使用（refetchを渡す）
  const { handleEdit, handleBackToDraft, handleCopyUrl, handleDeleteDraft } =
    useOpportunityActions(refetch);

  return (
    <Item asChild>
      <a href={`/admin/opportunities/${opportunity.id}`} className="flex flex-1 gap-3">
        {/* --- LEFT CONTENT --- */}
        <div className="flex flex-1 flex-col min-w-0">
          <ItemContent>
            {/* タイトル（2行で ...） */}
            <ItemTitle className={cn("font-bold text-base leading-snug", "line-clamp-2")}>
              {opportunity.title}
            </ItemTitle>
          </ItemContent>

          {/* --- FOOTER（公開中・日付） --- */}
          <ItemFooter className="mt-2">
            <div className="text-xs text-muted-foreground flex items-center gap-2 truncate">
              <span className="flex items-center gap-1">
                <span
                  className={cn(
                    "size-2.5 rounded-full",
                    PUBLISH_STATUS_COLORS[opportunity.publishStatus],
                  )}
                  aria-label={opportunity.publishStatusLabel}
                />
                {opportunity.publishStatusLabel}・{formatISODateTime(opportunity.updatedAt)}
              </span>
            </div>
          </ItemFooter>
        </div>

        {/* --- RIGHT IMAGE (あれば表示) --- */}
        {hasImage && (
          <div className="shrink-0 w-20 h-14 overflow-hidden rounded-md relative bg-muted">
            <Image src={imageUrl!} alt="" fill className="object-cover" sizes="80px" />
          </div>
        )}

        {/* --- ACTIONS (右端の … ) --- */}
        <OpportunityActionsMenu
          status={opportunity.publishStatus}
          onEdit={() => handleEdit(opportunity.id)}
          onBackToDraft={() => handleBackToDraft(opportunity.id)}
          onCopyUrl={() => handleCopyUrl(opportunity.id)}
          onDeleteDraft={() => handleDeleteDraft(opportunity.id)}
        />
      </a>
    </Item>
  );
}
