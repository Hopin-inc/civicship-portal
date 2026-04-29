"use client";

import { useCallback } from "react";
import { useApolloClient } from "@apollo/client";
import { GET_ADMIN_BROWSE_REPORTS } from "@/graphql/account/adminReports/query";
import type {
  GqlGetAdminBrowseReportsQuery,
  GqlGetAdminBrowseReportsQueryVariables,
} from "@/types/graphql";
import { useCursorPagination } from "@/app/sysAdmin/_shared/hooks/useCursorPagination";
import {
  CommunityReportsTab,
  type ReportRow,
} from "./CommunityReportsTab";

const PAGE_SIZE = 20;

type ReportsConnection = NonNullable<
  GqlGetAdminBrowseReportsQuery["adminBrowseReports"]
>;

type Props = {
  communityId: string;
  initialReports: ReportsConnection | null;
};

const EMPTY_CONNECTION: ReportsConnection = {
  __typename: "ReportsConnection",
  edges: [],
  pageInfo: {
    __typename: "PageInfo",
    hasNextPage: false,
    endCursor: null,
  },
  totalCount: 0,
};

/**
 * `CommunityReportsTab` (View) のための data wiring。
 *
 * 初期 1 ページは SSR (`fetchAdminBrowseReportsServer`) で取得して props で
 * 受け取る。以降は generic な `useCursorPagination` フックに任せ、totalCount /
 * error / loading / loadMore を一括管理する (= テンプレ詳細の Container と
 * 同じパターン)。
 *
 * `useCursorPagination` を使う方針: SSR と整合させたいので Apollo cache を
 * 経由せず、SSR data を `initial` として hook に渡す。fetchMore は client.query
 * で都度叩く。
 *
 * `resetKey={communityId}` でコミュニティ切替 (= 同コンポーネントが別 community
 * 用に再利用される) 時に内部 state を再同期する。
 */
export function CommunityReportsTabContainer({
  communityId,
  initialReports,
}: Props) {
  const apollo = useApolloClient();

  const fetchMoreReports = useCallback(
    async (cursor: string, first: number) => {
      const result = await apollo.query<
        GqlGetAdminBrowseReportsQuery,
        GqlGetAdminBrowseReportsQueryVariables
      >({
        query: GET_ADMIN_BROWSE_REPORTS,
        variables: { communityId, cursor, first },
        fetchPolicy: "network-only",
      });
      return result.data.adminBrowseReports ?? EMPTY_CONNECTION;
    },
    [apollo, communityId],
  );

  const {
    items: reports,
    totalCount,
    hasNextPage,
    loading: loadingMore,
    error: loadError,
    loadMore,
  } = useCursorPagination({
    initial: initialReports ?? EMPTY_CONNECTION,
    fetchMore: fetchMoreReports,
    pageSize: PAGE_SIZE,
    resetKey: communityId,
  });

  const handleLoadMore = useCallback(() => {
    void loadMore();
  }, [loadMore]);

  // fragment (`AdminBrowseReportFields`) -> ReportRow へのマッピング。
  // feedbacks.totalCount を平坦化して View 側の表示を簡素化する。
  const reportRows: ReportRow[] = reports.map((r) => ({
    id: r.id,
    variant: r.variant,
    status: r.status,
    publishedAt: r.publishedAt,
    feedbacksCount: r.feedbacks.totalCount,
  }));

  return (
    <CommunityReportsTab
      communityId={communityId}
      reports={reportRows}
      totalCount={totalCount}
      hasNextPage={hasNextPage}
      loading={false}
      error={loadError}
      loadingMore={loadingMore}
      onLoadMore={handleLoadMore}
    />
  );
}
