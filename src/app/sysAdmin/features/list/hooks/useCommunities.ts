"use client";

import { useMemo } from "react";
import { useGetCommunitiesQuery } from "@/types/graphql";

export interface CommunityListItem {
  id: string;
  name: string;
}

export function useCommunities() {
  const { data, loading, error, refetch } = useGetCommunitiesQuery({
    fetchPolicy: "cache-and-network",
  });

  const communities = useMemo<CommunityListItem[]>(() => {
    const edges = data?.communities?.edges ?? [];
    return edges
      .map((edge) => edge?.node)
      .filter((node): node is NonNullable<typeof node> => Boolean(node))
      .map((node) => ({
        id: node.id,
        name: node.name ?? "",
      }));
  }, [data]);

  return {
    communities,
    loading,
    error,
    refetch,
  };
}
