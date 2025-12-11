"use client";

import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import React, { useState } from "react";
import { useQuery, DocumentNode, QueryHookOptions, ApolloError } from "@apollo/client";
import { toast } from "react-toastify";

export interface UseInfiniteScrollQueryResult<TData, TEdge> {
  data: TData | undefined;
  loading: boolean;
  error: ApolloError | undefined;
  loadMoreRef: (node: HTMLDivElement | null) => void;
  refetch: () => void;
  hasNextPage: boolean;
  isLoadingMore: boolean;
  edges: TEdge[];
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

export const useInfiniteScrollQuery = <
  TData = unknown,
  TConnection extends { edges: TEdge[]; pageInfo: { hasNextPage: boolean; endCursor?: string | null } } = any,
  TEdge = unknown
>(
  query: DocumentNode,
  options: QueryHookOptions<TData, any> & {
    connectionKey: keyof TData;
    onError?: (error: any) => string | void;
  }
): UseInfiniteScrollQueryResult<TData, TEdge> => {
  const { connectionKey, onError, ...queryOptions } = options;
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { data, loading, error, fetchMore, refetch } = useQuery<TData, any>(query, {
    ...queryOptions,
    fetchPolicy: "cache-first",
    nextFetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const connection = (data?.[connectionKey] as TConnection) ?? fallbackConnection;
  const endCursor = connection.pageInfo?.endCursor;
  const hasNextPage = connection.pageInfo?.hasNextPage ?? false;
  const edges = (connection.edges as TEdge[]) ?? [];

  const handleFetchMore = async () => {
    if (!hasNextPage || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: {
          ...queryOptions.variables,
          cursor: endCursor,
        },
        updateQuery: (prev: any, { fetchMoreResult }: { fetchMoreResult: any }) => {
          if (!fetchMoreResult || !prev[connectionKey] || !fetchMoreResult[connectionKey]) {
            return prev;
          }

          const prevConnection = prev[connectionKey];
          const newConnection = fetchMoreResult[connectionKey];

          return {
            ...prev,
            [connectionKey]: {
              ...prevConnection,
              edges: [...(prevConnection.edges), ...(newConnection.edges)],
              pageInfo: newConnection.pageInfo,
            },
          };
        },
      });
    } catch (error) {
      const errorMessage = onError ? onError(error) : "データの読み込みに失敗しました。";
      if (typeof errorMessage === "string") {
        toast.error(errorMessage);
      }
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
    data,
    loading,
    error,
    loadMoreRef,
    refetch,
    hasNextPage,
    isLoadingMore,
    edges,
  };
}; 