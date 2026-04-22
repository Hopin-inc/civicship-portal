"use client";

import { useMemo, useState } from "react";
import type { GqlSysAdminCommunityOverview } from "@/types/graphql";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CommunityOverviewRow } from "./CommunityOverviewRow";
import { sysAdminDashboardJa } from "@/app/sysAdmin/_shared/i18n/ja";
import { cn } from "@/lib/utils";

type SortKey =
  | "communityName"
  | "communityActivityRate"
  | "growthRateActivity"
  | "latestCohortRetentionM1"
  | "totalMembers"
  | "tier1Count"
  | "tier2Count"
  | "passiveCount";

type SortOrder = "asc" | "desc";

type Props = {
  rows: GqlSysAdminCommunityOverview[];
  onRowClick?: (communityId: string) => void;
};

export function CommunityOverviewTable({ rows, onRowClick }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("communityActivityRate");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (av === bv) return 0;
      if (av === null || av === undefined) return 1;
      if (bv === null || bv === undefined) return -1;
      if (typeof av === "number" && typeof bv === "number") {
        return sortOrder === "desc" ? bv - av : av - bv;
      }
      const as = String(av);
      const bs = String(bv);
      return sortOrder === "desc" ? bs.localeCompare(as) : as.localeCompare(bs);
    });
    return copy;
  }, [rows, sortKey, sortOrder]);

  const toggleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortOrder("desc");
    }
  };

  const HeaderCell = ({ k, children }: { k: SortKey; children: React.ReactNode }) => {
    const isActive = k === sortKey;
    return (
      <TableHead
        aria-sort={isActive ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
      >
        <button
          type="button"
          onClick={() => toggleSort(k)}
          className={cn(
            "flex items-center gap-1 text-xs uppercase tracking-wide",
            isActive && "text-foreground",
          )}
        >
          <span>{children}</span>
          {isActive && <span aria-hidden>{sortOrder === "asc" ? "▲" : "▼"}</span>}
        </button>
      </TableHead>
    );
  };

  const columns = sysAdminDashboardJa.overview.columns;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <HeaderCell k="communityName">{columns.name}</HeaderCell>
          <HeaderCell k="communityActivityRate">{columns.activityRate}</HeaderCell>
          <HeaderCell k="growthRateActivity">{columns.growth}</HeaderCell>
          <HeaderCell k="latestCohortRetentionM1">{columns.latestRetentionM1}</HeaderCell>
          <HeaderCell k="totalMembers">{columns.totalMembers}</HeaderCell>
          <HeaderCell k="tier1Count">{columns.tier1}</HeaderCell>
          <HeaderCell k="tier2Count">{columns.tier2}</HeaderCell>
          <HeaderCell k="passiveCount">{columns.passive}</HeaderCell>
          <TableHead>{columns.alerts}</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sorted.map((row) => (
          <CommunityOverviewRow key={row.communityId} row={row} onClick={onRowClick} />
        ))}
      </TableBody>
    </Table>
  );
}
