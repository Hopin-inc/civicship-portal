"use client";

import { useGetMembershipListQuery } from "@/types/graphql";
import { presenterBasePins } from "@/app/places/data/presenter/membership";
import { useMemo } from "react";

export default function usePlacePins() {
  const { data, loading, error, fetchMore } = useGetMembershipListQuery({
    variables: {
      filter: {},
      IsCard: false,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const memberships = useMemo(
    () => data?.memberships?.edges?.flatMap((edge) => (edge?.node ? [edge.node] : [])) ?? [],
    [data?.memberships?.edges],
  );

  const placePins = useMemo(() => presenterBasePins(memberships), [memberships]);

  // const pageInfo = data?.memberships?.pageInfo;
  // const endCursor = pageInfo?.endCursor;
  // const hasNextPage = pageInfo?.hasNextPage ?? false;

  /*const handleFetchMore = async () => {
    if (!hasNextPage) return;

    await fetchMore({
      variables: {
        cursor: { after: endCursor },
        first: 10,
        IsCard: false,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || !fetchMoreResult.memberships) return prev;

        return {
          ...prev,
          memberships: {
            ...fetchMoreResult.memberships,
            edges: [
              ...(prev.memberships?.edges ?? []),
              ...(fetchMoreResult.memberships?.edges ?? []),
            ],
            pageInfo: fetchMoreResult.memberships.pageInfo,
          },
        };
      },
    });
  };*/

  // const loadMoreRef = useInfiniteScroll({
  //   hasMore: hasNextPage,
  //   isLoading: loading,
  //   onLoadMore: handleFetchMore,
  // });

  return {
    placePins,
    memberships,
    loading,
    error: error ?? null,
    // loadMoreRef,
  };
}
