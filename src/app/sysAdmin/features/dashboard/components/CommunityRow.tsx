"use client";

import React from "react";
import { Item, ItemContent, ItemFooter, ItemTitle } from "@/components/ui/item";
import { PercentDelta } from "@/app/sysAdmin/_shared/components/PercentDelta";
import { PrimaryAlertBadge } from "@/app/sysAdmin/_shared/components/PrimaryAlertBadge";
import { toIntJa, toPct } from "@/app/sysAdmin/_shared/format/number";
import { cn } from "@/lib/utils";
import type { GqlSysAdminCommunityOverview } from "@/types/graphql";

type Props = {
  row: GqlSysAdminCommunityOverview;
  onClick?: (communityId: string) => void;
};

/**
 * opportunities の OpportunityItem を参考にした compact な 1 行表示。
 * 構造:
 * - status (アラートがある場合のみ、タイトル上に小さく)
 * - community name (bold base)
 * - footer: 稼働率・前月比・人数 (xs muted)
 */
export function CommunityRow({ row, onClick }: Props) {
  const handleClick = () => onClick?.(row.communityId);
  const hasAlert =
    row.alerts.activeDrop || row.alerts.churnSpike || row.alerts.noNewMembers;

  return (
    <Item
      className={cn(
        "flex flex-col items-start gap-1",
        onClick && "cursor-pointer transition-colors hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
      onClick={onClick ? handleClick : undefined}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
    >
      {hasAlert && <PrimaryAlertBadge alerts={row.alerts} />}

      <ItemContent>
        <ItemTitle className="text-base font-semibold">
          {row.communityName}
        </ItemTitle>
      </ItemContent>

      <ItemFooter className="mt-0">
        <div className="flex flex-wrap items-baseline gap-x-2 text-xs text-muted-foreground">
          <span className="inline-flex items-baseline gap-1">
            <span>稼働率 {toPct(row.communityActivityRate)}</span>
            {row.growthRateActivity != null && (
              <span aria-label="前月比">
                (
                <PercentDelta
                  value={row.growthRateActivity}
                  className="text-xs"
                />
                )
              </span>
            )}
          </span>
          <span aria-hidden>·</span>
          <span>{toIntJa(row.totalMembers)}人</span>
        </div>
      </ItemFooter>
    </Item>
  );
}
