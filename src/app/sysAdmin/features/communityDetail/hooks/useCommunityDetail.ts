"use client";

import { useMemo } from "react";
import type { ApolloError, ApolloQueryResult } from "@apollo/client";
import {
  type GqlGetSysAdminCommunityDetailQuery,
  type GqlSysAdminCommunityDetailInput,
  type GqlSysAdminCommunityDetailPayload,
  useGetSysAdminCommunityDetailQuery,
} from "@/types/graphql";
import type { DashboardControlsState } from "@/app/sysAdmin/features/dashboard/hooks/useDashboardControls";
import { resolvePeriodToInput } from "@/app/sysAdmin/_shared/components/PeriodPresetSelect";
import type { DetailControlsState } from "./useDetailControls";

type Args = {
  communityId: string;
  dashboardControls: DashboardControlsState;
  detailControls: DetailControlsState;
  limit?: number;
};

export type CommunityDetailResult = {
  loading: boolean;
  error: ApolloError | undefined;
  detail: GqlSysAdminCommunityDetailPayload | null;
  input: GqlSysAdminCommunityDetailInput;
  fetchMore: (opts: {
    variables: { input: GqlSysAdminCommunityDetailInput };
  }) => Promise<ApolloQueryResult<GqlGetSysAdminCommunityDetailQuery>>;
  refetch: () => Promise<ApolloQueryResult<GqlGetSysAdminCommunityDetailQuery>>;
};

export function useCommunityDetail({
  communityId,
  dashboardControls,
  detailControls,
  limit = 50,
}: Args): CommunityDetailResult {
  const input = useMemo<GqlSysAdminCommunityDetailInput>(() => {
    const { asOf, windowMonths } = resolvePeriodToInput(dashboardControls.period);
    return {
      communityId,
      asOf: asOf ? new Date(asOf) : undefined,
      segmentThresholds: {
        tier1: dashboardControls.tier1,
        tier2: dashboardControls.tier2,
      },
      windowMonths,
      userFilter: {
        minSendRate: detailControls.filter.minSendRate ?? undefined,
        maxSendRate: detailControls.filter.maxSendRate ?? undefined,
        minDonationOutMonths: detailControls.filter.minDonationOutMonths ?? undefined,
        minMonthsIn: detailControls.filter.minMonthsIn ?? undefined,
      },
      userSort: {
        field: detailControls.sort.field,
        order: detailControls.sort.order,
      },
      limit,
    };
  }, [communityId, dashboardControls, detailControls, limit]);

  const { data, loading, error, fetchMore, refetch } = useGetSysAdminCommunityDetailQuery({
    variables: { input },
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  return {
    loading,
    error,
    detail: data?.sysAdminCommunityDetail ?? null,
    input,
    fetchMore,
    refetch,
  };
}
