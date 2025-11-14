"use client";

import {
  GqlDidIssuanceRequest,
  GqlDidIssuanceStatus,
  GqlMembershipsConnection,
  GqlRole,
  GqlUser,
} from "@/types/graphql";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { useState, useEffect } from "react";
import { fetchMemberships, fetchMoreMemberships } from "@/app/admin/members/actions";

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

  const [localConnection, setLocalConnection] = useState<GqlMembershipsConnection | null>(
    initialConnection ?? null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!searchQuery) {
      if (ssrFetched && initialConnection) {
        setLocalConnection(initialConnection);
      }
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetchMemberships({
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
        if (result.ssrFetched && result.connection) {
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
  }, [searchQuery, communityId, pageSize, ssrFetched, initialConnection]);

  const memberships = localConnection ?? fallbackConnection;
  const endCursor = memberships.pageInfo?.endCursor;
  const hasNextPage = memberships.pageInfo?.hasNextPage ?? false;
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const handleFetchMore = async () => {
    if (!hasNextPage || !enablePagination || isFetchingMore) return;

    if (!endCursor) {
      console.warn("Invalid endCursor:", endCursor);
      return;
    }

    const cursorParts = endCursor.split("_");
    if (cursorParts.length !== 2) {
      console.warn("Invalid endCursor format:", endCursor);
      return;
    }

    setIsFetchingMore(true);
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
      const result = await fetchMemberships({
        filter: {
          ...(searchQuery && { keyword: searchQuery }),
          communityId,
        },
        first: pageSize,
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
    isLoading: isLoading || isFetchingMore,
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
    loading: isLoading,
    error: error,
    hasNextPage,
    isFetchingMore,
    loadMoreRef,
    refetch,
  };
}
