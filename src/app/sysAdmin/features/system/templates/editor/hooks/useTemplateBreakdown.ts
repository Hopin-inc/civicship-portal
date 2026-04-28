"use client";

import { useMemo } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import {
  GqlReportTemplateKind,
  useGetReportTemplateStatsBreakdownQuery,
  type GqlReportTemplateStatsBreakdownRowFieldsFragment,
  type GqlReportVariant,
} from "@/types/graphql";

const HISTORY_PAGE_SIZE = 50;

/**
 * 1 variant 分の breakdown rows を取得。
 * default で `includeInactive: true` を渡し、過去 version も含めて UI 側で
 * VersionSelector でフィルタリングする。
 *
 * `kind` で GENERATION / JUDGE を切替可能。
 *
 * 行数が 50 を超える運用になったら useCursorPagination で wrap する。
 */
export function useTemplateBreakdown(
  variant: GqlReportVariant | null,
  kind: GqlReportTemplateKind = GqlReportTemplateKind.Generation,
) {
  const { user, loading: authLoading } = useAuth();

  const { data, loading, error, refetch } = useGetReportTemplateStatsBreakdownQuery({
    variables: {
      // skip により null variant 時は呼ばれないので non-null assertion で安全。
      variant: variant!,
      kind,
      includeInactive: true,
      first: HISTORY_PAGE_SIZE,
    },
    skip: !variant || authLoading || !user,
    fetchPolicy: "cache-and-network",
  });

  const rows: GqlReportTemplateStatsBreakdownRowFieldsFragment[] = useMemo(
    () =>
      data?.reportTemplateStatsBreakdown.edges
        ?.map((e) => e?.node)
        .filter(
          (n): n is GqlReportTemplateStatsBreakdownRowFieldsFragment => n != null,
        ) ?? [],
    [data],
  );

  return { rows, loading, error, refetch };
}
