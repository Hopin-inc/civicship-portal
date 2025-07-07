import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { GET_MEMBERSHIP_LIST } from "@/graphql/account/membership/query";
import { useQuery } from "@apollo/client";
import { GqlMembershipStatus, GqlSortDirection, GqlUser, GqlRole } from "@/types/graphql";
import React from "react";

export const useInfiniteMembers = (communityId: string) => {
  const {
    data,
    loading,
    error,
    fetchMore,
    refetch,
  } = useQuery(GET_MEMBERSHIP_LIST, {
    variables: {
      filter: {
        communityIds: [communityId],
        status: GqlMembershipStatus.Joined,
      },
      sort: {
        createdAt: GqlSortDirection.Asc,
      },
      first: 20,
      withDidIssuanceRequests: true,
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const connection = data?.memberships ?? { edges: [], pageInfo: {} };
  const endCursor = connection.pageInfo?.endCursor;
  const hasNextPage = connection.pageInfo?.hasNextPage ?? false;

  const [isLoadingMore, setIsLoadingMore] = React.useState(false);

  const handleFetchMore = async () => {
    if (!hasNextPage || isLoadingMore) return;
    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: {
          cursor: { endCursor },
        },
        updateQuery: (prev: any, { fetchMoreResult }: any) => {
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

  const members = (connection.edges ?? [])
    .map((edge: any) => {
      const user = edge?.node?.user;
      const role = edge?.node?.role;
      return user && role ? { user, role } : null;
    })
    .filter((member: any): member is { user: GqlUser; role: GqlRole } => member !== null);

  return {
    members,
    loading,
    error,
    loadMoreRef,
    refetch,
    hasNextPage,
    isLoadingMore,
  };
}; 