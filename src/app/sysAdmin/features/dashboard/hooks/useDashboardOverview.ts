"use client";

import { useMemo } from "react";
import type { ApolloError } from "@apollo/client";
import {
  type GqlSysAdminCommunityOverview,
  type GqlSysAdminPlatformSummary,
  useGetSysAdminDashboardQuery,
} from "@/types/graphql";
import type { DashboardControlsState } from "./useDashboardControls";
import { resolvePeriodToInput } from "@/app/sysAdmin/_shared/components/PeriodPresetSelect";

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
  const { asOf: asOfIso } = useMemo(
    () => resolvePeriodToInput(controls.period),
    [controls.period],
  );

  const { data, loading, error } = useGetSysAdminDashboardQuery({
    variables: {
      input: {
        asOf: asOfIso ? new Date(asOfIso) : undefined,
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
