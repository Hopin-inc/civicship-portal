"use client";

import { useMemo } from "react";
import {
  GqlReportVariant,
  useGetReportTemplateStatsBreakdownQuery,
  type GqlReportTemplateStatsBreakdownRowFieldsFragment,
} from "@/types/graphql";
import {
  aggregateVariantSummary,
  type VariantSummary,
} from "@/app/sysAdmin/features/system/templates/shared/aggregate";

/**
 * L1 一覧用、4 variant 並列で breakdown を取得して各 variant のサマリを返す。
 *
 * Apollo armor の alias 制限 (3 個) があるため、1 query で全 variant を
 * 並べることはできず、variant ごとに useQuery を fan-out している。
 * Apollo Client が並列 batch を内部処理するため、ネットワーク的には
 * concurrent な 4 リクエスト。
 */
export function useVariantSummaries() {
  const newsletter = useGetReportTemplateStatsBreakdownQuery({
    variables: { variant: GqlReportVariant.MemberNewsletter },
    fetchPolicy: "cache-and-network",
  });
  const weekly = useGetReportTemplateStatsBreakdownQuery({
    variables: { variant: GqlReportVariant.WeeklySummary },
    fetchPolicy: "cache-and-network",
  });
  const grant = useGetReportTemplateStatsBreakdownQuery({
    variables: { variant: GqlReportVariant.GrantApplication },
    fetchPolicy: "cache-and-network",
  });
  const media = useGetReportTemplateStatsBreakdownQuery({
    variables: { variant: GqlReportVariant.MediaPr },
    fetchPolicy: "cache-and-network",
  });

  const summaries: VariantSummary[] = useMemo(
    () => [
      aggregateVariantSummary(
        GqlReportVariant.MemberNewsletter,
        extractRows(newsletter.data?.reportTemplateStatsBreakdown.edges),
      ),
      aggregateVariantSummary(
        GqlReportVariant.WeeklySummary,
        extractRows(weekly.data?.reportTemplateStatsBreakdown.edges),
      ),
      aggregateVariantSummary(
        GqlReportVariant.GrantApplication,
        extractRows(grant.data?.reportTemplateStatsBreakdown.edges),
      ),
      aggregateVariantSummary(
        GqlReportVariant.MediaPr,
        extractRows(media.data?.reportTemplateStatsBreakdown.edges),
      ),
    ],
    [newsletter.data, weekly.data, grant.data, media.data],
  );

  const loading =
    newsletter.loading || weekly.loading || grant.loading || media.loading;
  const error =
    newsletter.error ?? weekly.error ?? grant.error ?? media.error;

  return { summaries, loading, error };
}

function extractRows(
  edges: ReadonlyArray<{ node?: GqlReportTemplateStatsBreakdownRowFieldsFragment | null } | null> | null | undefined,
): GqlReportTemplateStatsBreakdownRowFieldsFragment[] {
  if (!edges) return [];
  return edges
    .map((e) => e?.node)
    .filter(
      (n): n is GqlReportTemplateStatsBreakdownRowFieldsFragment => n != null,
    );
}
