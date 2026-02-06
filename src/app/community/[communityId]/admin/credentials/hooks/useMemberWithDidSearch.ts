"use client";

import {
  GqlDidIssuanceRequest,
  GqlDidIssuanceStatus,
  GqlMembershipsConnection,
  GqlMembershipStatus,
  GqlMembershipStatusReason,
  GqlRole,
  GqlUser,
} from "@/types/graphql";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { useEffect, useMemo, useRef, useState } from "react";
import { queryMemberships } from "@/app/community/[communityId]/admin/members/actions";

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
  },
) {
  const searchQuery = options?.searchQuery ?? "";
  const enablePagination = options?.enablePagination ?? false;
  const pageSize = options?.pageSize ?? 20;
  const initialConnection = options?.initialConnection;

  const membersFallbackConnection = useMemo<GqlMembershipsConnection>(() => {
    const edges = members.map((m) => ({
      cursor: `${m.user.id}_${communityId}`,
      node: {
        user: m.user,
        role: GqlRole.Member,
        reason: GqlMembershipStatusReason.AcceptedInvitation,
        status: GqlMembershipStatus.Joined,
      },
    }));

    return {
      edges,
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
      totalCount: members.length,
    };
  }, [members, communityId]);

  const [localConnection, setLocalConnection] = useState<GqlMembershipsConnection | null>(
    initialConnection ?? null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    if (!searchQuery) {
      if (initializedRef.current) {
        return;
      }
      
      initializedRef.current = true;
      
      if (initialConnection) {
        setLocalConnection(initialConnection);
        return;
      }
      
      let cancelled = false;
      setIsLoading(true);
      setError(null);

      queryMemberships({
        filter: {
          communityId,
        },
        first: pageSize,
        withWallets: true,
        withDidIssuanceRequests: true,
      })
        .then((result) => {
          if (cancelled) return;
          if (result.connection) {
            setLocalConnection(result.connection);
          } else {
            setLocalConnection(membersFallbackConnection);
            setError(new Error("Failed to fetch initial results"));
          }
        })
        .catch((err) => {
          if (cancelled) return;
          setLocalConnection(membersFallbackConnection);
          setError(err);
        })
        .finally(() => {
          if (cancelled) return;
          setIsLoading(false);
        });

      return () => {
        cancelled = true;
      };
    }

    initializedRef.current = false;

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    queryMemberships({
      filter: {
        keyword: searchQuery,
        communityId,
      },
      first: pageSize,
      withWallets: true,
      withDidIssuanceRequests: true,
    })
      .then((result) => {
        if (cancelled) return;
        if (result.connection) {
          setLocalConnection(result.connection);
        } else {
          setError(new Error("Failed to fetch search results"));
        }
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err);
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [searchQuery, communityId, pageSize, initialConnection, membersFallbackConnection]);

  const memberships = localConnection ?? fallbackConnection;
  const endCursor = memberships.pageInfo?.endCursor;
  const hasNextPage = memberships.pageInfo?.hasNextPage ?? false;
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const handleFetchMore = async () => {
    if (!hasNextPage || !enablePagination || isFetchingMore) return;

    // Get the last edge's user ID for cursor-based pagination
    // The backend returns opaque endCursor strings, but MembershipCursorInput requires userId and communityId
    const edges = memberships.edges ?? [];
    const lastEdge = edges[edges.length - 1];
    const lastUserId = lastEdge?.node?.user?.id;

    if (!lastUserId) {
      console.warn("Cannot build cursor: no valid last edge with user ID");
      return;
    }

    setIsFetchingMore(true);
    try {
      const result = await queryMemberships({
        cursor: { userId: lastUserId, communityId },
        filter: {
          ...(searchQuery && { keyword: searchQuery }),
          communityId,
        },
        first: pageSize,
        withWallets: true,
        withDidIssuanceRequests: true,
      });

      if (result.connection) {
        setLocalConnection((prev) => {
          if (!prev) return result.connection;

          const existingEdges = prev.edges ?? [];
          const newEdges = result.connection?.edges ?? [];

          const mergedEdges = [
            ...new Map(
              [...existingEdges, ...newEdges].map((edge) => [
                edge?.cursor,
                edge,
              ]),
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
      setIsFetchingMore(false);
    }
  };

  const refetch = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await queryMemberships({
        filter: {
          ...(searchQuery && { keyword: searchQuery }),
          communityId,
        },
        first: pageSize,
        withWallets: true,
        withDidIssuanceRequests: true,
      });
      if (result.connection) {
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
    isLoading: isLoading || isFetchingMore,
    onLoadMore: handleFetchMore,
  });

  const usersWithDid = memberships.edges
    ?.map((edge) => {
      const node = edge?.node;
      if (!node?.user) return null;
      const user = node.user;
      const role = node.role ?? GqlRole.Member; // Default to Member if not present
      const didInfo = user.didIssuanceRequests?.find(
        (req) => req?.status === GqlDidIssuanceStatus.Completed,
      );

      const gqlWallet = user.wallets?.find((w) => w?.community?.id === communityId);
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
    loading: isLoading,
    error: error,
    hasNextPage,
    isFetchingMore,
    isLoadingMore: isFetchingMore, // Backward compatibility alias
    handleFetchMore,
    loadMoreRef,
    refetch,
  };
}
