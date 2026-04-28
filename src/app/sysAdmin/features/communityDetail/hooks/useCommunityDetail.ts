"use client";

import { useMemo, useRef } from "react";
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
import { DEFAULT_SEGMENT_THRESHOLDS } from "@/app/sysAdmin/_shared/derive";

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
//
// minSendRate は明示的に 0 を渡す。schema default が 0.7 (habitual のみ)
// で、空のまま渡すと server 側で silent に filter され、loaded 上位 N 名で
// 計算する派生メトリクス (avgRecipients / paretoTopShare / tenuredRatio /
// isolated alert) が全部 habitual-only に偏る。
const FIXED_USER_FILTER = { minSendRate: 0 } as const;
const FIXED_USER_SORT = {
  field: GqlSysAdminUserSortField.TotalPointsOut,
  order: GqlSysAdminSortOrder.Desc,
} as const;

// L2 の HistoryBars footer は 12 期間表示を前提にしているため、period preset
// が 3 ヶ月などでも query 側は最低 12 ヶ月分の trend を返してもらう。
const L2_MIN_WINDOW_MONTHS = 12;

export function useCommunityDetail({
  communityId,
  dashboardControls,
  initialData = null,
  limit = 1000,
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
        minMonthsIn: DEFAULT_SEGMENT_THRESHOLDS.minMonthsIn,
      },
      // L2 の HistoryBars / cohortFunnel が 12 期間表示を前提にしているため、
      // period preset (default 3 ヶ月など) よりも常に 12 を下限とする。
      // 「全期間」(36 ヶ月) を選んだ場合はその値を使う。
      windowMonths: Math.max(L2_MIN_WINDOW_MONTHS, windowMonths),
      userFilter: FIXED_USER_FILTER,
      userSort: FIXED_USER_SORT,
      limit,
    };
  }, [communityId, dashboardControls, limit]);

  const isAtDefaults =
    dashboardControls.period === DEFAULT_PERIOD &&
    dashboardControls.tier1 === DEFAULT_SEGMENT_THRESHOLDS.tier1 &&
    dashboardControls.tier2 === DEFAULT_SEGMENT_THRESHOLDS.tier2;

  // SSR data injection: write the initialData payload into Apollo's cache
  // for the exact (query, variables) tuple BEFORE the hook's useQuery runs.
  // Combined with `fetchPolicy: cache-first` below, the first render reads
  // straight out of cache (no network round-trip, no auth race) AND the
  // fetchMore handle is bound to a real registered query — so the member-
  // list pagination keeps working past the SSR-skip path. Skip the prior
  // approach (`skip: true` + ad-hoc fallback) where fetchMore was a no-op.
  //
  // Track seeding by communityId (not bool) so inter-community navigation
  // (`/sysAdmin/community-a` → `/sysAdmin/community-b`) re-seeds on the
  // first render of the new id. A `useEffect([communityId])` reset would
  // run after render and miss the cache lookup window, causing a wasted
  // network round-trip on every nav.
  const seededIdRef = useRef<string | null>(null);
  if (seededIdRef.current !== communityId && isAtDefaults && initialData) {
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
    seededIdRef.current = communityId;
  }

  const { data, loading, error, fetchMore, refetch } = useGetSysAdminCommunityDetailQuery({
    variables: { input },
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const detail = useMemo<DetailPayload | null>(() => {
    if (data?.sysAdminCommunityDetail) return data.sysAdminCommunityDetail;
    // initialData は SSR 時のデフォルト controls (period / tier1 / tier2)
    // で fetch したものなので、ユーザーが controls を変えた直後の loading 中に
    // フォールバックすると古い defaults データが見えてしまう。
    // isAtDefaults の時だけ fallback し、それ以外は null (= LoadingIndicator)。
    return isAtDefaults ? initialData : null;
  }, [data, initialData, isAtDefaults]);

  return {
    loading,
    error,
    detail,
    input,
    fetchMore,
    refetch,
  };
}
