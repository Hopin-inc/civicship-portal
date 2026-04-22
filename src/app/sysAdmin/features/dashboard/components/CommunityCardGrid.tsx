"use client";

import React, { useMemo, useState } from "react";
import type { GqlSysAdminCommunityOverview } from "@/types/graphql";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { StageLegend } from "@/app/sysAdmin/_shared/components/StageLegend";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { CommunityCard } from "./CommunityCard";

type SortKey =
  | "communityActivityRate"
  | "growthRateActivity"
  | "tier1Count"
  | "latestCohortRetentionM1";

type Props = {
  rows: GqlSysAdminCommunityOverview[];
  onRowClick?: (communityId: string) => void;
};

function compareDesc(a: number | null | undefined, b: number | null | undefined): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return 1;
  if (b === null || b === undefined) return -1;
  return b - a;
}

export function CommunityCardGrid({ rows, onRowClick }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("communityActivityRate");

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      switch (sortKey) {
        case "communityActivityRate":
          return compareDesc(a.communityActivityRate, b.communityActivityRate);
        case "growthRateActivity":
          return compareDesc(a.growthRateActivity, b.growthRateActivity);
        case "tier1Count":
          return compareDesc(a.tier1Count, b.tier1Count);
        case "latestCohortRetentionM1":
          return compareDesc(a.latestCohortRetentionM1, b.latestCohortRetentionM1);
        default:
          return 0;
      }
    });
    return copy;
  }, [rows, sortKey]);

  const sortLabels = sysAdminDashboardJa.overview.sort;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <StageLegend />
        <div className="flex items-center gap-2">
          <Label htmlFor="overview-sort" className="text-xs text-muted-foreground">
            {sortLabels.placeholder}
          </Label>
          <Select value={sortKey} onValueChange={(v) => setSortKey(v as SortKey)}>
            <SelectTrigger id="overview-sort" className="h-9 w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="communityActivityRate">{sortLabels.activityRate}</SelectItem>
              <SelectItem value="growthRateActivity">{sortLabels.growth}</SelectItem>
              <SelectItem value="tier1Count">{sortLabels.tier1Count}</SelectItem>
              <SelectItem value="latestCohortRetentionM1">{sortLabels.latestRetentionM1}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((row) => (
          <CommunityCard key={row.communityId} row={row} onClick={onRowClick} />
        ))}
      </div>
    </div>
  );
}
