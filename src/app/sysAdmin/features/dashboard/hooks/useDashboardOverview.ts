"use client";

import { useMemo } from "react";
import type { ApolloError } from "@apollo/client";
import {
  type GqlGetSysAdminDashboardQuery,
  type GqlSysAdminCommunityOverview,
  type GqlSysAdminPlatformSummary,
  useGetSysAdminDashboardQuery,
} from "@/types/graphql";
import type { DashboardControlsState } from "./useDashboardControls";
import {
  DEFAULT_PERIOD,
  resolvePeriodToInput,
} from "@/app/sysAdmin/_shared/components/PeriodPresetSelect";

export type DashboardOverviewResult = {
  loading: boolean;
  error: ApolloError | undefined;
  platform: GqlSysAdminPlatformSummary | null;
  communities: GqlSysAdminCommunityOverview[];
  asOf: Date | null;
};

const DEFAULT_TIER1 = 0.7;
const DEFAULT_TIER2 = 0.4;

/**
 * SSR で取得した初期データと、クライアント側のコントロール変化時のみ発火する
 * Apollo client query の両方を統合する。
 *
 * - 初期 (controls がデフォルト) は SSR データをそのまま使う ([skip] でクエリは飛ばさない)
 * - period/tier 変更で controls がデフォルトから外れたら、Apollo client query が
 *   `cache-and-network` で発火する
 */
export function useDashboardOverview(
  controls: DashboardControlsState,
  initialData: GqlGetSysAdminDashboardQuery["sysAdminDashboard"] | null,
): DashboardOverviewResult {
  const { asOf: asOfIso } = useMemo(
    () => resolvePeriodToInput(controls.period),
    [controls.period],
  );

  const isAtDefaults =
    controls.period === DEFAULT_PERIOD &&
    controls.tier1 === DEFAULT_TIER1 &&
    controls.tier2 === DEFAULT_TIER2;
  // SSR データがあり、コントロールがデフォルト (= SSR fetch 時の input) と一致する
  // 場合のみ初回クエリをスキップ。コントロールが変わったら Apollo に問い合わせる。
  const skipInitialQuery = isAtDefaults && !!initialData;

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
    skip: skipInitialQuery,
    fetchPolicy: "cache-and-network",
  });

  return useMemo<DashboardOverviewResult>(() => {
    // SSR データを fallback として使う条件:
    // - クライアント query を skip 中 (デフォルト controls のまま)
    // - もしくは Apollo がまだ data を返していない (初回フェッチ中)
    const useSsr = skipInitialQuery || !data?.sysAdminDashboard;
    const source = useSsr ? initialData : data?.sysAdminDashboard ?? null;

    return {
      loading: !useSsr && loading,
      error,
      platform: source?.platform ?? null,
      communities: source?.communities ?? [],
      asOf: source?.asOf ?? null,
    };
  }, [data, loading, error, skipInitialQuery, initialData]);
}
