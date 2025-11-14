import { GqlMembershipStatus, GqlMembershipsConnection, GqlSortDirection, useGetMembershipListQuery } from "@/types/graphql";
import { useState, useEffect } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { fetchMoreMemberships } from "../actions";

export const useMembershipQueries = (
  communityId: string,
  options?: {
    initialConnection?: GqlMembershipsConnection | null;
    ssrFetched?: boolean;
  }
) => {
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const ssrFetched = options?.ssrFetched ?? false;
  const initialConnection = options?.initialConnection;

  const firebaseUser = useAuthStore((s) => s.state.firebaseUser);
  const authReady = !!firebaseUser;

  const [localConnection, setLocalConnection] = useState<GqlMembershipsConnection | null>(
    initialConnection ?? null
  );

  const { data, loading, error, refetch, fetchMore } = useGetMembershipListQuery({
    variables: {
      filter: {
        communityId,
      },
      first: 20,
      withWallets: true,
      withDidIssuanceRequests: true,
    },
    skip: ssrFetched || !authReady,
    fetchPolicy: ssrFetched ? "cache-first" : "network-only",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (ssrFetched && initialConnection) {
      setLocalConnection(initialConnection);
    } else if (data?.memberships) {
      setLocalConnection(data.memberships);
    }
  }, [data, initialConnection, ssrFetched]);

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
      
      const result = await fetchMoreMemberships({
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
      } else if (authReady) {
        await fetchMore({
          variables: {
            cursor: { userId, communityId: communityIdFromCursor },
            filter: {
              communityId,
            },
            first: 20,
            withWallets: true,
            withDidIssuanceRequests: true,
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
      }
    } catch (err) {
      console.error("Server Action fetchMore failed:", err);
      if (authReady) {
        const [userId, communityIdFromCursor] = endCursor.split("_");
        await fetchMore({
          variables: {
            cursor: { userId, communityId: communityIdFromCursor },
            filter: {
              communityId,
            },
            first: 20,
            withWallets: true,
            withDidIssuanceRequests: true,
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
