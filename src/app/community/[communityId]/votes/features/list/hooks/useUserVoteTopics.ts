"use client";

import { useMemo, useState } from "react";
import { useGetVoteTopicsForUserQuery } from "@/types/graphql";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { presentUserVoteList } from "../presenters/presentUserVoteList";

interface UseUserVoteTopicsParams {
  communityId: string;
}

export function useUserVoteTopics({ communityId }: UseUserVoteTopicsParams) {
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, loading, error, fetchMore, refetch } =
    useGetVoteTopicsForUserQuery({
      variables: { communityId, first: 20 },
      fetchPolicy: "cache-and-network",
      nextFetchPolicy: "cache-first",
    });

  const connection = data?.voteTopics;
  const endCursor = connection?.pageInfo.endCursor;
  const hasNextPage = connection?.pageInfo.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: { communityId, first: 20, cursor: endCursor },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult?.voteTopics || !prev.voteTopics) return prev;
          return {
            ...prev,
            voteTopics: {
              ...prev.voteTopics,
              edges: [
                ...new Map(
                  [
                    ...prev.voteTopics.edges,
                    ...fetchMoreResult.voteTopics.edges,
                  ]
                    .filter((edge) => edge.node)
                    .map((edge) => [edge.node.id, edge]),
                ).values(),
              ],
              pageInfo: fetchMoreResult.voteTopics.pageInfo,
              totalCount: fetchMoreResult.voteTopics.totalCount,
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

  const items = useMemo(
    () => (data ? presentUserVoteList(data.voteTopics) : []),
    [data],
  );

  return {
    items,
    loading,
    error,
    refetch,
    loadMoreRef,
    hasNextPage,
    isLoadingMore,
  };
}
