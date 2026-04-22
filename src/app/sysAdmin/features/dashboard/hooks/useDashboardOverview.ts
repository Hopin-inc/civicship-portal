"use client";

import { useMemo } from "react";
import type { ApolloError } from "@apollo/client";
import {
  type GqlSysAdminCommunityOverview,
  type GqlSysAdminPlatformSummary,
  useGetSysAdminDashboardQuery,
} from "@/types/graphql";
import type { DashboardControlsState } from "./useDashboardControls";

export type DashboardOverviewResult = {
  loading: boolean;
  error: ApolloError | undefined;
  platform: GqlSysAdminPlatformSummary | null;
  communities: GqlSysAdminCommunityOverview[];
  asOf: Date | null;
};

export function useDashboardOverview(
  controls: DashboardControlsState,
): DashboardOverviewResult {
  const { data, loading, error } = useGetSysAdminDashboardQuery({
    variables: {
      input: {
        asOf: controls.asOf ? new Date(controls.asOf) : undefined,
        segmentThresholds: {
          tier1: controls.tier1,
          tier2: controls.tier2,
        },
      },
    },
    fetchPolicy: "cache-and-network",
  });

  return useMemo<DashboardOverviewResult>(
    () => ({
      loading,
      error,
      platform: data?.sysAdminDashboard?.platform ?? null,
      communities: data?.sysAdminDashboard?.communities ?? [],
      asOf: data?.sysAdminDashboard?.asOf ?? null,
    }),
    [data, loading, error],
  );
}
