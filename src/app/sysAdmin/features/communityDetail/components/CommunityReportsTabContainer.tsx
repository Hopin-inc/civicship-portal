"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useApolloClient } from "@apollo/client";
import { GET_ADMIN_BROWSE_REPORTS } from "@/graphql/account/adminReports/query";
import type {
  GqlGetAdminBrowseReportsQuery,
  GqlGetAdminBrowseReportsQueryVariables,
} from "@/types/graphql";
import { useCursorPagination } from "@/app/sysAdmin/_shared/hooks/useCursorPagination";
import { createEmptyConnection } from "@/app/sysAdmin/_shared/pagination/emptyConnection";
import { stableFilterKey } from "@/app/sysAdmin/_shared/pagination/filterKey";
import {
  CommunityReportsTab,
  type ReportRow,
} from "./CommunityReportsTab";
import {
  EMPTY_FILTER,
  type CommunityReportsFilterValue,
} from "./CommunityReportsFilter";

const PAGE_SIZE = 20;

type ReportsConnection = NonNullable<
  GqlGetAdminBrowseReportsQuery["adminBrowseReports"]
>;

type Props = {
  communityId: string;
  initialReports: ReportsConnection | null;
};

const EMPTY_CONNECTION = createEmptyConnection("ReportsConnection") as ReportsConnection;

/**
 * `CommunityReportsTab` (View) のための data wiring。
 *
 * 初期 1 ページは SSR (`fetchAdminBrowseReportsServer`, フィルタ無し) で取得して
 * props で受け取る。filter が default のときはその SSR data をそのまま使い、
 * filter が変わったら client 側で 1 ページ目を取り直して `useCursorPagination`
 * の `initial` を差し替える (resetKey 連動)。
 *
 * 「もっと見る」は引き続き Apollo `client.query` で次ページを叩く。filter は
 * fetchMore variables にも含めるので、フィルタ中の続きが正しく取れる。
 */
export function CommunityReportsTabContainer({
  communityId,
  initialReports,
}: Props) {
  const apollo = useApolloClient();

  const [filter, setFilter] = useState<CommunityReportsFilterValue>(EMPTY_FILTER);
  const filterKey = useMemo(
    () => stableFilterKey({ ...filter }),
    [filter],
  );

  /**
   * `useCursorPagination` の `initial` に渡す Connection。
   * filter が default なら SSR data、それ以外なら client refetch の結果。
   */
  const [currentConnection, setCurrentConnection] = useState<ReportsConnection>(
    initialReports ?? EMPTY_CONNECTION,
  );
  const [refetching, setRefetching] = useState(false);

  // filter 変更の追従:
  //   - default に戻ったら SSR data に戻す
  //   - それ以外は filter を変数に乗せて 1 ページ目を取り直す
  useEffect(() => {
    if (filterKey === "") {
      setCurrentConnection(initialReports ?? EMPTY_CONNECTION);
      setRefetching(false);
      return;
    }
    let cancelled = false;
    setRefetching(true);
    void (async () => {
      try {
        const result = await apollo.query<
          GqlGetAdminBrowseReportsQuery,
          GqlGetAdminBrowseReportsQueryVariables
        >({
          query: GET_ADMIN_BROWSE_REPORTS,
          variables: {
            communityId,
            first: PAGE_SIZE,
            status: filter.status ?? undefined,
            variant: filter.variant ?? undefined,
            publishedAfter: toIsoStart(filter.publishedAfter) ?? undefined,
            publishedBefore: toIsoEnd(filter.publishedBefore) ?? undefined,
          },
          fetchPolicy: "network-only",
        });
        if (cancelled) return;
        setCurrentConnection(result.data.adminBrowseReports ?? EMPTY_CONNECTION);
      } catch {
        // useCursorPagination 側で error が出るのは追加ロード時のみ。
        // ここでは「フィルタ中の初回取得失敗」として空 Connection を入れて、
        // table の empty / error は presentational 側に任せる。
        if (!cancelled) setCurrentConnection(EMPTY_CONNECTION);
      } finally {
        if (!cancelled) setRefetching(false);
      }
    })();
    return () => {
      cancelled = true;
    };
    // initialReports は SSR で 1 度だけ作られるので識別子変化＝コミュニティ切替。
    // filter は filterKey 経由で識別する (object 参照差分は無視)。
  }, [filterKey, communityId, apollo, filter, initialReports]);

  const fetchMoreReports = useCallback(
    async (cursor: string, first: number) => {
      const result = await apollo.query<
        GqlGetAdminBrowseReportsQuery,
        GqlGetAdminBrowseReportsQueryVariables
      >({
        query: GET_ADMIN_BROWSE_REPORTS,
        variables: {
          communityId,
          cursor,
          first,
          status: filter.status ?? undefined,
          variant: filter.variant ?? undefined,
          publishedAfter: toIsoStart(filter.publishedAfter) ?? undefined,
          publishedBefore: toIsoEnd(filter.publishedBefore) ?? undefined,
        },
        fetchPolicy: "network-only",
      });
      return result.data.adminBrowseReports ?? EMPTY_CONNECTION;
    },
    [apollo, communityId, filter],
  );

  const {
    items: reports,
    totalCount,
    hasNextPage,
    loading: loadingMore,
    error: loadError,
    loadMore,
  } = useCursorPagination({
    initial: currentConnection,
    fetchMore: fetchMoreReports,
    pageSize: PAGE_SIZE,
    resetKey: `${communityId}:${filterKey}`,
  });

  const handleLoadMore = useCallback(() => {
    void loadMore();
  }, [loadMore]);

  // backend fragment (`AdminBrowseReportFields`) は ReportRow の super set
  // (id/variant/status/publishedAt + community{id,name}) なので構造的に互換。
  const reportRows: ReportRow[] = reports;

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
      filter={filter}
      onFilterChange={setFilter}
      filterRefetching={refetching}
    />
  );
}

/**
 * "YYYY-MM-DD" を Date (start of day, UTC) に変換。
 * backend が `Datetime` スカラ (codegen 上は Date) を期待する。
 */
function toIsoStart(date: string | null | undefined): Date | null {
  if (!date) return null;
  return new Date(`${date}T00:00:00.000Z`);
}

/**
 * "YYYY-MM-DD" を Date (end of day, UTC) に変換。
 */
function toIsoEnd(date: string | null | undefined): Date | null {
  if (!date) return null;
  return new Date(`${date}T23:59:59.999Z`);
}
