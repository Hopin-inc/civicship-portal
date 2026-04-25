"use client";

import { useEffect, useMemo, useRef } from "react";
import { useApolloClient, type ApolloError, type ApolloQueryResult } from "@apollo/client";
import {
  GetSysAdminCommunityDetailDocument,
  GqlSysAdminSortOrder,
  GqlSysAdminUserSortField,
  type GqlGetSysAdminCommunityDetailQuery,
  type GqlGetSysAdminCommunityDetailQueryVariables,
  type GqlSysAdminCommunityDetailInput,
  useGetSysAdminCommunityDetailQuery,
} from "@/types/graphql";
import type { DashboardControlsState } from "@/app/sysAdmin/features/dashboard/hooks/useDashboardControls";
import {
  DEFAULT_PERIOD,
  resolvePeriodToInput,
} from "@/app/sysAdmin/_shared/components/PeriodPresetSelect";

// Use the codegen-derived shape so the typed Apollo query result and our
// hook return type stay in lockstep (the bare GqlSysAdminCommunityDetailPayload
// has __typename optional while the query result narrows it to the literal).
type DetailPayload = NonNullable<
  GqlGetSysAdminCommunityDetailQuery["sysAdminCommunityDetail"]
>;

type Args = {
  communityId: string;
  dashboardControls: DashboardControlsState;
  /** SSR で取得した初期データ。controls がデフォルトのままなら client query を skip する */
  initialData?: DetailPayload | null;
  limit?: number;
};

export type CommunityDetailResult = {
  loading: boolean;
  error: ApolloError | undefined;
  detail: DetailPayload | null;
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

const DEFAULT_TIER1 = 0.7;
const DEFAULT_TIER2 = 0.4;

export function useCommunityDetail({
  communityId,
  dashboardControls,
  initialData = null,
  limit = 50,
}: Args): CommunityDetailResult {
  const client = useApolloClient();

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

  const isAtDefaults =
    dashboardControls.period === DEFAULT_PERIOD &&
    dashboardControls.tier1 === DEFAULT_TIER1 &&
    dashboardControls.tier2 === DEFAULT_TIER2;

  // SSR data injection: write the initialData payload into Apollo's cache
  // for the exact (query, variables) tuple BEFORE the hook's useQuery runs.
  // Combined with `fetchPolicy: cache-first` below, the first render reads
  // straight out of cache (no network round-trip, no auth race) AND the
  // fetchMore handle is bound to a real registered query — so the member-
  // list pagination keeps working past the SSR-skip path. Skip the prior
  // approach (`skip: true` + ad-hoc fallback) where fetchMore was a no-op.
  const seededRef = useRef(false);
  if (!seededRef.current && isAtDefaults && initialData) {
    client.writeQuery<
      GqlGetSysAdminCommunityDetailQuery,
      GqlGetSysAdminCommunityDetailQueryVariables
    >({
      query: GetSysAdminCommunityDetailDocument,
      variables: { input },
      data: {
        __typename: "Query",
        sysAdminCommunityDetail: initialData,
      },
    });
    seededRef.current = true;
  }
  // Re-seed when communityId changes (route navigation between communities).
  useEffect(() => {
    seededRef.current = false;
  }, [communityId]);

  const { data, loading, error, fetchMore, refetch } = useGetSysAdminCommunityDetailQuery({
    variables: { input },
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const detail = useMemo<DetailPayload | null>(() => {
    return data?.sysAdminCommunityDetail ?? initialData ?? null;
  }, [data, initialData]);

  return {
    loading,
    error,
    detail,
    input,
    fetchMore,
    refetch,
  };
}
