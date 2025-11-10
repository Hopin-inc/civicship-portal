"use client";

import {
  GqlDidIssuanceRequest,
  GqlDidIssuanceStatus,
  GqlUser,
  useGetMembershipListQuery,
} from "@/types/graphql";
import { ApolloError } from "@apollo/client";
import React, { useState } from "react";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export type MemberSearchFormValues = {
  searchQuery: string;
};

export interface MemberSearchTarget {
  user: GqlUser;
  wallet?: {
    currentPointView?: {
      currentPoint: bigint;
    };
  };
}

//TODO: credentials配下ではなく、共通化する場所に移動する
export const useMemberWithDidSearch = (
  communityId: string,
  members: MemberSearchTarget[] = [],
  options?: {
    searchQuery?: string;
    enablePagination?: boolean;
    pageSize?: number;
  },
): {
  data: (GqlUser & { didInfo?: GqlDidIssuanceRequest } & {
    wallet?: {
      currentPointView?: {
        currentPoint: bigint;
      };
    };
  })[];
  loading: boolean;
  error: ApolloError | undefined;
  hasNextPage: boolean;
  isLoadingMore: boolean;
  handleFetchMore: () => Promise<void>;
  loadMoreRef: React.RefObject<HTMLDivElement>;
  refetch: () => void;
} => {
  const searchQuery = options?.searchQuery ?? "";
  const enablePagination = options?.enablePagination ?? false;
  const pageSize = options?.pageSize ?? 20;
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    data: searchMembershipData,
    loading,
    error,
    fetchMore: apolloFetchMore,
    refetch,
  } = useGetMembershipListQuery({
    variables: {
      filter: {
        ...(searchQuery && { keyword: searchQuery }), // 検索クエリがある場合のみkeywordを追加
        communityId,
      },
      withWallets: true,
      withDidIssuanceRequests: true,
      first: enablePagination ? pageSize : undefined,
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const users = searchMembershipData?.memberships?.edges
    ?.map((edge) => edge?.node?.user)
    .filter((user): user is GqlUser => !!user) ?? [];

  const usersWithDid = users?.map((user) => {
    const didInfo = user.didIssuanceRequests?.find(
      (request) => request?.status === GqlDidIssuanceStatus.Completed,
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

    return {
      ...user,
      didInfo,
      wallet,
    };
  });

  const pageInfo = searchMembershipData?.memberships?.pageInfo;
  const hasNextPage = pageInfo?.hasNextPage ?? false;
  

  const handleFetchMore = async () => {
    if (!hasNextPage || isLoadingMore || !enablePagination) return;
    
    const endCursor = pageInfo?.endCursor;
    if (!endCursor || typeof endCursor !== "string") {
      return;
    }
    
    setIsLoadingMore(true);
    try {
      const [userId, communityId] = endCursor.split("_");
      await apolloFetchMore({
        variables: {
          cursor: { userId, communityId },
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
    data: usersWithDid ?? [],
    loading,
    error,
    hasNextPage,
    isLoadingMore,
    handleFetchMore,
    loadMoreRef,
    refetch,
  };
};
