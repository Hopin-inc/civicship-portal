"use client";

import {
  GqlDidIssuanceRequest,
  GqlDidIssuanceStatus,
  GqlMembershipsConnection,
  GqlRole,
  GqlUser,
  useGetMembershipListQuery,
} from "@/types/graphql";
import { ApolloError, NetworkStatus } from "@apollo/client";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { useAuthStore } from "@/lib/auth/core/auth-store";
import { useState, useEffect } from "react";
import { fetchMoreMemberships } from "@/app/admin/members/actions";

const fallbackConnection = {
  edges: [],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  },
};

export function useMemberWithDidSearch(
  communityId: string,
  members: { user: GqlUser; wallet?: { currentPointView?: { currentPoint: bigint } } }[] = [],
  options?: {
    searchQuery?: string;
    enablePagination?: boolean;
    pageSize?: number;
    initialConnection?: GqlMembershipsConnection | null;
    ssrFetched?: boolean;
  },
) {
  const searchQuery = options?.searchQuery ?? "";
  const enablePagination = options?.enablePagination ?? false;
  const pageSize = options?.pageSize ?? 20;
  const ssrFetched = options?.ssrFetched ?? false;
  const initialConnection = options?.initialConnection;

  const firebaseUser = useAuthStore((s) => s.state.firebaseUser);
  const authReady = !!firebaseUser;

  const [localConnection, setLocalConnection] = useState<GqlMembershipsConnection | null>(
    initialConnection ?? null
  );
  const [isServerActionLoading, setIsServerActionLoading] = useState(false);

  const shouldSkipCSR = (ssrFetched && !searchQuery) || !authReady;

  const { data, loading, fetchMore, refetch, error, networkStatus } = useGetMembershipListQuery({
    variables: {
      filter: {
        ...(searchQuery && { keyword: searchQuery }),
        communityId,
      },
      withWallets: true,
      withDidIssuanceRequests: true,
      first: enablePagination ? pageSize : undefined,
    },
    skip: shouldSkipCSR,
    fetchPolicy: shouldSkipCSR ? "cache-first" : "network-only",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (ssrFetched && initialConnection && !searchQuery) {
      setLocalConnection(initialConnection);
    } else if (data?.memberships) {
      setLocalConnection(data.memberships);
    }
  }, [data, initialConnection, ssrFetched, searchQuery]);

  const memberships = localConnection ?? fallbackConnection;
  const endCursor = memberships.pageInfo?.endCursor;
  const hasNextPage = memberships.pageInfo?.hasNextPage ?? false;
  const isFetchingMore = isServerActionLoading || networkStatus === NetworkStatus.fetchMore;

  const handleFetchMore = async () => {
    if (!hasNextPage || !enablePagination || isServerActionLoading) return;

    if (!endCursor) {
      console.warn("Invalid endCursor:", endCursor);
      return;
    }

    const cursorParts = endCursor.split("_");
    if (cursorParts.length !== 2) {
      console.warn("Invalid endCursor format:", endCursor);
      return;
    }

    setIsServerActionLoading(true);
    try {
      const result = await fetchMoreMemberships({
        cursor: { userId: cursorParts[0], communityId: cursorParts[1] },
        filter: {
          ...(searchQuery && { keyword: searchQuery }),
          communityId,
        },
        first: pageSize,
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
            filter: {
              ...(searchQuery && { keyword: searchQuery }),
              communityId,
            },
            withWallets: true,
            withDidIssuanceRequests: true,
            cursor: { userId: cursorParts[0], communityId: cursorParts[1] },
            first: pageSize,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult?.memberships?.edges) return prev;

            return {
              ...prev,
              memberships: {
                ...prev.memberships,
                edges: [
                  ...new Map(
                    [...(prev.memberships?.edges ?? []), ...fetchMoreResult.memberships.edges].map(
                      (edge) => [edge?.node?.user?.id, edge],
                    ),
                  ).values(),
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
        await fetchMore({
          variables: {
            filter: {
              ...(searchQuery && { keyword: searchQuery }),
              communityId,
            },
            withWallets: true,
            withDidIssuanceRequests: true,
            cursor: { userId: cursorParts[0], communityId: cursorParts[1] },
            first: pageSize,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult?.memberships?.edges) return prev;

            return {
              ...prev,
              memberships: {
                ...prev.memberships,
                edges: [
                  ...new Map(
                    [...(prev.memberships?.edges ?? []), ...fetchMoreResult.memberships.edges].map(
                      (edge) => [edge?.node?.user?.id, edge],
                    ),
                  ).values(),
                ],
                pageInfo: fetchMoreResult.memberships.pageInfo,
              },
            };
          },
        });
      }
    } finally {
      setIsServerActionLoading(false);
    }
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loading || isFetchingMore,
    onLoadMore: handleFetchMore,
  });

  const usersWithDid = memberships.edges
    ?.map((edge) => {
      const node = edge?.node;
      if (!node?.user) return null;
      const user = node.user;
      const role = node.role!;
      const didInfo = user.didIssuanceRequests?.find(
        (req) => req?.status === GqlDidIssuanceStatus.Completed,
      );

      const gqlWallet = user.wallets?.find((w) => w?.community?.id === COMMUNITY_ID);
      const fallbackWallet = members.find((m) => m.user.id === user.id)?.wallet;
      const wallet = {
        currentPointView: {
          currentPoint:
            fallbackWallet?.currentPointView?.currentPoint ??
            BigInt(gqlWallet?.currentPointView?.currentPoint ?? 0),
        },
      };

      return { ...user, didInfo, wallet, role };
    })
    .filter(Boolean) as (GqlUser & {
    didInfo?: GqlDidIssuanceRequest;
    wallet?: { currentPointView?: { currentPoint: bigint } };
    role: GqlRole;
  })[];

  return {
    data: usersWithDid,
    loading,
    error: error as ApolloError | undefined,
    hasNextPage,
    isFetchingMore,
    loadMoreRef,
    refetch,
  };
}
