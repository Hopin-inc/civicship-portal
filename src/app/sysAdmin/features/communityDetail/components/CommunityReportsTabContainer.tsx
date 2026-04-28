"use client";

import { useCallback, useRef, useState } from "react";
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

  // setLoadingMore / setEndCursor / setHasNextPage は state なので非同期で反映
  // される。rapid に「もっと見る」を連打した時に同じ cursor で重複 fetch しない
  // よう、同期的な ref で guard する (useCursorPagination と同じパターン)。
  // Relay 実装によっては最終ページでも `endCursor` が non-null で返ることが
  // あるので、`hasNextPageRef` を必ず併用する。
  const loadingRef = useRef(false);
  const endCursorRef = useRef<string | null>(
    initialReports?.pageInfo.endCursor ?? null,
  );
  const hasNextPageRef = useRef<boolean>(
    initialReports?.pageInfo.hasNextPage ?? false,
  );

  const handleLoadMore = useCallback(async () => {
    if (
      loadingRef.current ||
      !hasNextPageRef.current ||
      !endCursorRef.current
    ) {
      return;
    }
    const cursor = endCursorRef.current;
    loadingRef.current = true;
    setLoadingMore(true);
    setLoadError(null);
    try {
      const result = await apollo.query<
        GqlGetAdminBrowseReportsQuery,
        GqlGetAdminBrowseReportsQueryVariables
      >({
        query: GET_ADMIN_BROWSE_REPORTS,
        variables: { communityId, cursor, first: PAGE_SIZE },
        fetchPolicy: "network-only",
      });
      const next = result.data.adminBrowseReports;
      const nextEndCursor = next.pageInfo.endCursor ?? null;
      const nextHasNextPage = next.pageInfo.hasNextPage;
      endCursorRef.current = nextEndCursor;
      hasNextPageRef.current = nextHasNextPage;
      setReports((prev) => [...prev, ...extractReports(next)]);
      setEndCursor(nextEndCursor);
      setHasNextPage(nextHasNextPage);
    } catch (err) {
      // catch しないと button onClick で発火する promise が unhandled rejection に
      // なる。View 側は error prop を表示できるので state にセットして渡す。
      setLoadError(err);
    } finally {
      loadingRef.current = false;
      setLoadingMore(false);
    }
  }, [apollo, communityId]);

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
