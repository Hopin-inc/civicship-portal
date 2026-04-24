"use client";

import { useMemo } from "react";
import type { ApolloError, ApolloQueryResult } from "@apollo/client";
import {
  GqlSysAdminSortOrder,
  GqlSysAdminUserSortField,
  type GqlGetSysAdminCommunityDetailQuery,
  type GqlSysAdminCommunityDetailInput,
  type GqlSysAdminCommunityDetailPayload,
  useGetSysAdminCommunityDetailQuery,
} from "@/types/graphql";
import type { DashboardControlsState } from "@/app/sysAdmin/features/dashboard/hooks/useDashboardControls";
import { resolvePeriodToInput } from "@/app/sysAdmin/_shared/components/PeriodPresetSelect";

type Args = {
  communityId: string;
  dashboardControls: DashboardControlsState;
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

// メンバー絞り込み / 並び替えの UI を撤廃し、Sys Admin 視点で「貢献度の高い順」に
// 固定する。totalPointsOut は頻度 (送付月数) と金額の双方を内包しているため
// 単一指標として最も全体把握に向く。
const FIXED_USER_FILTER = {} as const;
const FIXED_USER_SORT = {
  field: GqlSysAdminUserSortField.TotalPointsOut,
  order: GqlSysAdminSortOrder.Desc,
} as const;

export function useCommunityDetail({
  communityId,
  dashboardControls,
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
      userFilter: FIXED_USER_FILTER,
      userSort: FIXED_USER_SORT,
      limit,
    };
  }, [communityId, dashboardControls, limit]);

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
