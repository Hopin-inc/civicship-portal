"use client";

import { useMemo } from "react";
import { useGetMembershipListQuery } from "@/types/graphql";
import { presenterBaseCard } from "@/app/places/data/presenter/membership";

export default function usePlaceCards() {
  const { data, loading, error, refetch } = useGetMembershipListQuery({
    variables: {
      filter: {},
      first: 50,
      IsCard: true,
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const memberships = useMemo(
    () => data?.memberships?.edges?.flatMap((edge) => (edge?.node ? [edge.node] : [])) ?? [],
    [data?.memberships?.edges],
  );

  const baseCards = useMemo(() => presenterBaseCard(memberships), [memberships]);

  return {
    memberships,
    baseCards,
    loading,
    error: error ?? null,
    refetch,
  };
}
