"use client";

import { useMemo, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { GET_ADMIN_BROWSE_REPORTS } from "@/graphql/account/adminReports/query";
import type {
  GqlGetAdminBrowseReportsQuery,
  GqlGetAdminBrowseReportsQueryVariables,
} from "@/types/graphql";
import {
  CommunityReportsTab,
  type ReportRow,
} from "./CommunityReportsTab";

const PAGE_SIZE = 20;

type Props = {
  communityId: string;
  initialReports: GqlGetAdminBrowseReportsQuery["adminBrowseReports"] | null;
};

/**
 * `CommunityReportsTab` (View) のための data wiring。
 *
 * 初期 1 ページは SSR (`fetchAdminBrowseReportsServer`) で取得して props で
 * 受け取る。「もっと見る」での追加ページは Apollo client.query で fetch して
 * local state に append する。
 *
 * Apollo の `useQuery` 経路を使わない理由: SSR と整合させたいので Apollo
 * cache を経由せず、SSR data を一次ソースとして扱う。
 */
export function CommunityReportsTabContainer({
  communityId,
  initialReports,
}: Props) {
  const apollo = useApolloClient();
  const [reports, setReports] = useState<ReportRow[]>(
    () => extractReports(initialReports),
  );
  const [endCursor, setEndCursor] = useState<string | null>(
    initialReports?.pageInfo.endCursor ?? null,
  );
  const [hasNextPage, setHasNextPage] = useState<boolean>(
    initialReports?.pageInfo.hasNextPage ?? false,
  );
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState<unknown>(null);
  const totalCount = initialReports?.totalCount ?? reports.length;

  const handleLoadMore = useMemo(() => {
    return async () => {
      if (!endCursor || loadingMore) return;
      setLoadingMore(true);
      setLoadError(null);
      try {
        const result = await apollo.query<
          GqlGetAdminBrowseReportsQuery,
          GqlGetAdminBrowseReportsQueryVariables
        >({
          query: GET_ADMIN_BROWSE_REPORTS,
          variables: { communityId, cursor: endCursor, first: PAGE_SIZE },
          fetchPolicy: "network-only",
        });
        const next = result.data.adminBrowseReports;
        setReports((prev) => [...prev, ...extractReports(next)]);
        setEndCursor(next.pageInfo.endCursor ?? null);
        setHasNextPage(next.pageInfo.hasNextPage);
      } catch (err) {
        // catch しないと button onClick で発火する promise が unhandled rejection に
        // なる。View 側は error prop を表示できるので state にセットして渡す。
        setLoadError(err);
      } finally {
        setLoadingMore(false);
      }
    };
  }, [apollo, communityId, endCursor, loadingMore]);

  return (
    <CommunityReportsTab
      reports={reports}
      totalCount={totalCount}
      hasNextPage={hasNextPage}
      loading={false}
      error={loadError}
      loadingMore={loadingMore}
      onLoadMore={handleLoadMore}
    />
  );
}

function extractReports(
  conn: GqlGetAdminBrowseReportsQuery["adminBrowseReports"] | null | undefined,
): ReportRow[] {
  if (!conn) return [];
  return (
    conn.edges
      ?.map((e) => e?.node)
      .filter(<T,>(n: T | null | undefined): n is T => n != null) ?? []
  );
}
