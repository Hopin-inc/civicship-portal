"use client";

import { useMemo } from "react";
import {
  GqlReportVariant,
  useGetReportTemplateStatsBreakdownQuery,
  type GqlReportTemplateStatsBreakdownRowFieldsFragment,
} from "@/types/graphql";

const HISTORY_PAGE_SIZE = 50;

/**
 * 1 variant 分の breakdown rows を取得。
 * default で `includeInactive: true` を渡し、過去 version も含めて UI 側で
 * VersionSelector でフィルタリングする。
 *
 * 行数が 50 を超える運用になったら useCursorPagination で wrap する。
 */
export function useTemplateBreakdown(variant: GqlReportVariant | null) {
  const { data, loading, error, refetch } = useGetReportTemplateStatsBreakdownQuery({
    variables: variant
      ? { variant, includeInactive: true, first: HISTORY_PAGE_SIZE }
      : {
          variant: GqlReportVariant.MemberNewsletter,
          includeInactive: true,
          first: HISTORY_PAGE_SIZE,
        },
    skip: !variant,
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
