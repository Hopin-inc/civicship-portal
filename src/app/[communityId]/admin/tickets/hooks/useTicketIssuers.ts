"use client";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import React from "react";
import {
  GqlSortDirection,
  GqlTicketIssuerEdge,
  useGetTicketIssuersQuery,
} from "@/types/graphql";
import { useAuth } from "@/contexts/AuthProvider";
import { ApolloError } from "@apollo/client";

export interface UseTicketIssuersResult {
  ticketIssuers: (GqlTicketIssuerEdge | null)[];
  loading: boolean;
  error: ApolloError | undefined;
  loadMoreRef: (node: HTMLDivElement | null) => void;
  refetch: () => void;
  hasNextPage: boolean;
}

const fallbackConnection = {
  edges: [],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  },
  totalCount: 0,
};

export const useTicketIssuers = (): UseTicketIssuersResult => {
  const { user } = useAuth();
  
  const { data, loading, error, fetchMore, refetch } = useGetTicketIssuersQuery({
    variables: {
      filter: { ownerId: user?.id ?? "" },
      sort: { createdAt: GqlSortDirection.Desc },
      first: 10,
    },
    skip: !user,
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const connection = data?.ticketIssuers ?? fallbackConnection;
  const endCursor = connection.pageInfo?.endCursor;
  const hasNextPage = connection.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage) return;

    await fetchMore({
      variables: {
        filter: { ownerId: user?.id ?? "" },
        sort: { createdAt: GqlSortDirection.Desc },
        cursor: endCursor,
        first: 10,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || !prev.ticketIssuers || !fetchMoreResult.ticketIssuers) {
          return prev;
        }

        return {
          ...prev,
          ticketIssuers: {
            ...prev.ticketIssuers,
            edges: [
              ...new Map(
                [...(prev.ticketIssuers.edges ?? []), ...(fetchMoreResult.ticketIssuers.edges ?? [])].map(
                  (edge) => [edge?.node?.id, edge],
                ),
              ).values(),
            ],
            pageInfo: fetchMoreResult.ticketIssuers.pageInfo,
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
    ticketIssuers: (connection.edges ?? []).filter((edge): edge is GqlTicketIssuerEdge => edge !== null),
    loading,
    error,
    loadMoreRef,
    refetch,
    hasNextPage,
  };
}; 