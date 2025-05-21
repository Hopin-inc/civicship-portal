"use client";

import { GqlPlaceEdge, useGetPlacesQuery } from "@/types/graphql";
import { useMemo } from "react";
import { presenterPlacePins } from "@/app/places/data/presenter";

export default function usePlacePins() {
  const { data, loading, error, fetchMore, refetch } = useGetPlacesQuery({
    variables: { first: 100 },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const placeEdges: GqlPlaceEdge[] = (data?.places?.edges ?? []).filter(
    (e): e is GqlPlaceEdge => e != null && e.node != null,
  );
  const placePins = useMemo(() => presenterPlacePins(placeEdges), [placeEdges]);

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
    loading,
    error: error ?? null,
    // loadMoreRef,
    refetch,
  };
}
