"use client";

import { useMemo, useState } from "react";
import { useAuth } from "@/contexts/AuthProvider";
import { useGetAdminBrowseReportsQuery } from "@/types/graphql";
import {
  CommunityReportsTab,
  type ReportRow,
} from "./CommunityReportsTab";

const PAGE_SIZE = 20;

type Props = {
  communityId: string;
};

/**
 * `CommunityReportsTab` (View) と `useGetAdminBrowseReportsQuery` (data) を
 * 結ぶ container。
 *
 * 認証 race 回避のため `isAuthenticated` まで query を skip する。
 */
export function CommunityReportsTabContainer({ communityId }: Props) {
  const { isAuthenticated } = useAuth();
  const { data, loading, error, fetchMore } = useGetAdminBrowseReportsQuery({
    variables: { communityId, first: PAGE_SIZE },
    skip: !isAuthenticated,
    fetchPolicy: "cache-and-network",
  });
  const [loadingMore, setLoadingMore] = useState(false);

  const reports: ReportRow[] = useMemo(
    () =>
      data?.adminBrowseReports.edges
        ?.map((e) => e?.node)
        .filter(<T,>(n: T | null | undefined): n is T => n != null) ?? [],
    [data],
  );

  const totalCount = data?.adminBrowseReports.totalCount ?? 0;
  const hasNextPage = data?.adminBrowseReports.pageInfo.hasNextPage ?? false;
  const endCursor = data?.adminBrowseReports.pageInfo.endCursor ?? null;

  const handleLoadMore = async () => {
    if (!endCursor || loadingMore) return;
    setLoadingMore(true);
    try {
      await fetchMore({
        variables: { cursor: endCursor, first: PAGE_SIZE },
        updateQuery: (prev, { fetchMoreResult }) => ({
          adminBrowseReports: {
            ...fetchMoreResult.adminBrowseReports,
            edges: [
              ...(prev.adminBrowseReports.edges ?? []),
              ...(fetchMoreResult.adminBrowseReports.edges ?? []),
            ],
          },
        }),
      });
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <CommunityReportsTab
      reports={reports}
      totalCount={totalCount}
      hasNextPage={hasNextPage}
      loading={loading}
      error={error}
      loadingMore={loadingMore}
      onLoadMore={handleLoadMore}
    />
  );
}
