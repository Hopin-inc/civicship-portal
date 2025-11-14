import { GqlMembershipsConnection } from "@/types/graphql";
import { useState, useEffect } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { queryMemberships } from "../actions";

export const useMembershipQueries = (
  communityId: string,
  options?: {
    initialConnection?: GqlMembershipsConnection | null;
    ssrFetched?: boolean;
  }
) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const ssrFetched = options?.ssrFetched ?? false;
  const initialConnection = options?.initialConnection;

  const [localConnection, setLocalConnection] = useState<GqlMembershipsConnection | null>(
    initialConnection ?? null
  );

  useEffect(() => {
    if (!ssrFetched && !initialConnection && !localConnection) {
      let cancelled = false;
      setIsLoading(true);
      setError(null);

      queryMemberships({
        filter: {
          communityId,
        },
        first: 20,
        withWallets: true,
        withDidIssuanceRequests: true,
      })
        .then((result) => {
          if (cancelled) return;
          if (result.ssrFetched && result.connection) {
            setLocalConnection(result.connection);
          } else {
            setError(new Error("Failed to fetch initial data"));
          }
        })
        .catch((err) => {
          if (cancelled) return;
          setError(err as Error);
        })
        .finally(() => {
          if (cancelled) return;
          setIsLoading(false);
        });

      return () => {
        cancelled = true;
      };
    } else if (ssrFetched && initialConnection) {
      setLocalConnection(initialConnection);
    }
  }, [initialConnection, ssrFetched, communityId, localConnection]);

  const connection = localConnection ?? { edges: [], pageInfo: {} };
  const pageInfo =
    connection.pageInfo && "endCursor" in connection.pageInfo
      ? connection.pageInfo
      : { endCursor: undefined, hasNextPage: false };
  const endCursor = pageInfo.endCursor;
  const hasNextPage = pageInfo.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage || isLoadingMore || !endCursor) return;
    if (!endCursor.includes("_") || endCursor.split("_").length !== 2) {
      console.warn("endCursor format is invalid:", endCursor);
      return;
    }
    setIsLoadingMore(true);
    try {
      const [userId, communityIdFromCursor] = endCursor.split("_");
      
      const result = await queryMemberships({
        cursor: { userId, communityId: communityIdFromCursor },
        filter: {
          communityId,
        },
        first: 20,
        withWallets: true,
        withDidIssuanceRequests: true,
      });

      if (result.ssrFetched && result.connection) {
        setLocalConnection((prev) => {
          if (!prev) return result.connection;
          
          const existingEdges = prev.edges ?? [];
          const newEdges = result.connection?.edges ?? [];
          
          const mergedEdges = [
            ...new Map(
              [...existingEdges, ...newEdges].map((edge) => [
                edge?.node?.user?.id,
                edge,
              ])
            ).values(),
          ];

          return {
            ...prev,
            edges: mergedEdges,
            pageInfo: result.connection?.pageInfo ?? prev.pageInfo,
          };
        });
      } else {
        setError(new Error("Failed to fetch more results"));
      }
    } catch (err) {
      console.error("Server Action fetchMore failed:", err);
      setError(err as Error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await queryMemberships({
        filter: {
          communityId,
        },
        first: 20,
        withWallets: true,
        withDidIssuanceRequests: true,
      });
      if (result.ssrFetched && result.connection) {
        setLocalConnection(result.connection);
      } else {
        setError(new Error("Failed to refetch results"));
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: isLoading || isLoadingMore,
    onLoadMore: handleFetchMore,
  });

  return {
    membershipListData: localConnection,
    loading: isLoading,
    error,
    refetch,
    hasNextPage,
    isLoadingMore,
    handleFetchMore,
    loadMoreRef,
  };
};
