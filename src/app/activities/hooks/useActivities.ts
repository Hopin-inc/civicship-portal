"use client";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import React from "react";
import {
  GqlOpportunitiesConnection,
  GqlOpportunityCategory,
  GqlPublishStatus,
  useGetOpportunitiesQuery,
} from "@/types/graphql";

export interface UseActivitiesResult {
  opportunities: GqlOpportunitiesConnection;
  loading: boolean;
  error: any;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  refetch: () => void;
}

const fallbackConnection: GqlOpportunitiesConnection = {
  edges: [],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  },
  totalCount: 0,
};

export const useActivities = (): UseActivitiesResult => {
  const { data, loading, error, fetchMore, refetch } = useGetOpportunitiesQuery({
    variables: {
      filter: {
        category: GqlOpportunityCategory.Activity,
        publishStatus: [GqlPublishStatus.Public],
      },
      first: 20,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const opportunities = data?.opportunities ?? fallbackConnection;
  const endCursor = opportunities.pageInfo?.endCursor;
  const hasNextPage = opportunities.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage) return;

    await fetchMore({
      variables: {
        filter: {
          category: GqlOpportunityCategory.Activity,
          publishStatus: [GqlPublishStatus.Public],
        },
        cursor: endCursor,
        first: 10,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || !prev.opportunities || !fetchMoreResult.opportunities) {
          return prev;
        }

        return {
          ...prev,
          opportunities: {
            ...prev.opportunities,
            edges: [...prev.opportunities.edges, ...fetchMoreResult.opportunities.edges],
            pageInfo: fetchMoreResult.opportunities.pageInfo,
          },
        };
      },
    });
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loading,
    onLoadMore: handleFetchMore,
  });



  return {
    opportunities,
    loading,
    error,
    loadMoreRef,
    refetch,
  };
};
