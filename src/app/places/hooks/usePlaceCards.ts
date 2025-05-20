"use client";

import { useMemo } from "react";
import { GqlPlaceEdge, useGetPlacesQuery } from "@/types/graphql";
import { presenterPlaceCard } from "@/app/places/data/presenter";

export default function usePlaceCards() {
  const { data, loading, error, refetch } = useGetPlacesQuery({
    variables: {
      filter: {},
      first: 50,
      IsCard: true,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const placeEdges: GqlPlaceEdge[] = (data?.places?.edges ?? []).filter(
    (e): e is GqlPlaceEdge => e != null && e.node != null,
  );
  const baseCards = useMemo(() => presenterPlaceCard(placeEdges), [placeEdges]);

  return {
    baseCards,
    loading,
    error: error ?? null,
    refetch,
  };
}
