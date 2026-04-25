"use client";

import React from "react";
import { Item, ItemContent, ItemFooter, ItemTitle } from "@/components/ui/item";
import { PercentDelta } from "@/app/sysAdmin/_shared/components/PercentDelta";
import { toIntJa, toPct } from "@/app/sysAdmin/_shared/format/number";
import { cn } from "@/lib/utils";
import {
  deriveActivityRate,
  deriveChurnedSenders,
  deriveGrowthRateActivity,
  deriveHubUserPct,
  deriveNewlyActivatedSenders,
} from "@/app/sysAdmin/_shared/derive";
import type { GqlSysAdminCommunityOverview } from "@/types/graphql";

type Props = {
  row: GqlSysAdminCommunityOverview;
  onClick?: (communityId: string) => void;
};

export function CommunityRow({ row, onClick }: Props) {
  const handleClick = () => onClick?.(row.communityId);
  const activityRate = deriveActivityRate(row);
  const growthRateActivity = deriveGrowthRateActivity(row);
  const hubUserPct = deriveHubUserPct(row);
  const newMemberCount = row.windowActivity.newMemberCount;
  const newlyActivated = deriveNewlyActivatedSenders(row);
  const churned = deriveChurnedSenders(row);

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
      <ItemContent>
        <div className="flex w-full items-baseline justify-between gap-2">
          <ItemTitle className="min-w-0 flex-1 truncate text-base font-semibold">
            {row.communityName}
          </ItemTitle>
          <div className="flex shrink-0 items-baseline gap-1 tabular-nums text-muted-foreground">
            <span className="text-base font-medium">{toIntJa(row.totalMembers)}</span>
            <span className="text-xs">(+{toIntJa(newMemberCount)})</span>
          </div>
        </div>
      </ItemContent>

      <ItemFooter className="mt-0">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
          <KpiPill label="MAU" value={toPct(activityRate)} delta={growthRateActivity} />
          <KpiPill label="Hub" value={toPct(hubUserPct)} />
          <KpiPill label="Δ" value={`↑${toIntJa(newlyActivated)} ↓${toIntJa(churned)}`} />
        </div>
      </ItemFooter>
    </Item>
  );
}

type KpiPillProps = {
  label: string;
  value: string;
  delta?: number | null;
};

function KpiPill({ label, value, delta }: KpiPillProps) {
  return (
    <span className="inline-flex items-baseline gap-1">
      <span className="rounded-md border border-border px-1.5 py-px text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="text-sm font-medium tabular-nums">{value}</span>
      {delta !== undefined && delta !== null && (
        <span className="text-xs text-muted-foreground">
          (<PercentDelta value={delta} className="text-xs" />)
        </span>
      )}
    </span>
  );
}
