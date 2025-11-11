"use client";

import {
  GqlDidIssuanceRequest,
  GqlDidIssuanceStatus,
  GqlRole,
  GqlUser,
  useGetMembershipListQuery,
} from "@/types/graphql";
import { ApolloError, NetworkStatus } from "@apollo/client";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

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
  },
) {
  const searchQuery = options?.searchQuery ?? "";
  const enablePagination = options?.enablePagination ?? false;
  const pageSize = options?.pageSize ?? 20;

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
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
  });

  const memberships = data?.memberships ?? fallbackConnection;
  const endCursor = memberships.pageInfo?.endCursor;
  const hasNextPage = memberships.pageInfo?.hasNextPage ?? false;
  const isFetchingMore = networkStatus === NetworkStatus.fetchMore;

  const handleFetchMore = async () => {
    if (!hasNextPage || !enablePagination) return;

    await fetchMore({
      variables: {
        filter: {
          ...(searchQuery && { keyword: searchQuery }),
          communityId,
        },
        withWallets: true,
        withDidIssuanceRequests: true,
        cursor: { userId: endCursor?.split("_")[0], communityId: endCursor?.split("_")[1] },
        first: pageSize,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult?.memberships?.edges) return prev;

        // ID重複防止
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
