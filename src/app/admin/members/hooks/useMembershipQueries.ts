import { GqlMembershipStatus, GqlSortDirection, useGetMembershipListQuery } from "@/types/graphql";
import { useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export const useMembershipQueries = (communityId: string) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { data, loading, error, refetch, fetchMore } = useGetMembershipListQuery({
    variables: {
      filter: {
        communityId,
        status: GqlMembershipStatus.Joined,
      },
      sort: {
        createdAt: GqlSortDirection.Asc,
      },
      first: 20,
      withDidIssuanceRequests: true,
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const connection = data?.memberships ?? { edges: [], pageInfo: {} };
  const pageInfo = connection.pageInfo && "endCursor" in connection.pageInfo ? connection.pageInfo : { endCursor: undefined, hasNextPage: false };
  const endCursor = pageInfo.endCursor;
  const hasNextPage = pageInfo.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage || isLoadingMore || !endCursor) return;
    if (typeof endCursor !== "string" || !endCursor.includes("_") || endCursor.split("_").length !== 2) {
      console.warn("endCursor format is invalid:", endCursor);
      return;
    }
    setIsLoadingMore(true);
    try {
      const [userId, communityId] = endCursor.split("_");
      await fetchMore({
        variables: {
          cursor: { userId, communityId },
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            ...prev,
            memberships: {
              ...prev.memberships,
              edges: [
                ...(prev.memberships.edges ?? []),
                ...(fetchMoreResult.memberships.edges ?? []),
              ],
              pageInfo: fetchMoreResult.memberships.pageInfo,
            },
          };
        },
      });
    } finally {
      setIsLoadingMore(false);
    }
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loading || isLoadingMore,
    onLoadMore: handleFetchMore,
  });

  return {
    membershipListData: data,
    loading,
    error,
    refetch,
    hasNextPage,
    isLoadingMore,
    handleFetchMore,
    loadMoreRef,
  };
};
