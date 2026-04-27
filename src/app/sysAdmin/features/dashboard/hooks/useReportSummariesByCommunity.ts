"use client";

import { useMemo } from "react";
import { useGetAdminReportSummaryQuery } from "@/types/graphql";
import type { CommunityReportSummary } from "@/app/sysAdmin/features/dashboard/components/CommunityRow";

const PAGE_SIZE = 100;

/**
 * adminReportSummary を fetch して、`Map<communityId, CommunityReportSummary>` を返す。
 *
 * L1 一覧でコミュニティ行と merge して「最終Report N日前」を表示する用途。
 * cursor pagination は first=100 で 1 ページのみ取得 (現状規模で足りる前提)。
 * 将来規模が増えたら useCursorPagination で wrap する。
 */
export function useReportSummariesByCommunity() {
  const { data, loading, error } = useGetAdminReportSummaryQuery({
    variables: { first: PAGE_SIZE },
    fetchPolicy: "cache-and-network",
  });

  const summariesByCommunity = useMemo(() => {
    const map = new Map<string, CommunityReportSummary>();
    const edges = data?.adminReportSummary.edges ?? [];
    for (const edge of edges) {
      const node = edge?.node;
      if (!node) continue;
      map.set(node.community.id, {
        daysSinceLastPublish: node.daysSinceLastPublish ?? null,
        publishedCountLast90Days: node.publishedCountLast90Days,
      });
    }
    return map;
  }, [data]);

  return { summariesByCommunity, loading, error };
}
