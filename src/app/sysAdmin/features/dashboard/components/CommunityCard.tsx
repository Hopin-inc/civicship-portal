import React from "react";
import type { GqlSysAdminCommunityOverview } from "@/types/graphql";
import { Card } from "@/components/ui/card";
import { PercentDelta } from "@/app/sysAdmin/_shared/components/PercentDelta";
import { PrimaryAlertBadge } from "@/app/sysAdmin/_shared/components/PrimaryAlertBadge";
import { StageProgressBar } from "@/app/sysAdmin/_shared/components/StageProgressBar";
import { toPct } from "@/app/sysAdmin/_shared/format/number";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { cn } from "@/lib/utils";

type Props = {
  row: GqlSysAdminCommunityOverview;
  onClick?: (communityId: string) => void;
};

export function CommunityCard({ row, onClick }: Props) {
  const counts = {
    habitual: row.segmentCounts.tier1Count,
    regular: Math.max(0, row.segmentCounts.tier2Count - row.segmentCounts.tier1Count),
    occasional: Math.max(
      0,
      row.segmentCounts.activeCount - row.segmentCounts.tier2Count,
    ),
    latent: row.segmentCounts.passiveCount,
  };

  const handleClick = () => onClick?.(row.communityId);

  return (
    <Card
      className={cn(
        "flex flex-col gap-3 p-4 shadow-none",
        onClick && "cursor-pointer transition-colors hover:bg-muted/30",
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
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold">{row.communityName}</h3>
        <PrimaryAlertBadge alerts={row.alerts} />
      </div>

      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-semibold tabular-nums">
          {toPct(row.communityActivityRate)}
        </span>
        <PercentDelta value={row.growthRateActivity} className="text-sm" />
      </div>

      <StageProgressBar counts={counts} />

      <div className="flex items-center justify-between text-sm">
        <span className="text-muted-foreground">
          {sysAdminDashboardJa.overview.latestRetentionM1}
        </span>
        <span className="tabular-nums">{toPct(row.latestCohortRetentionM1)}</span>
      </div>
    </Card>
  );
}
