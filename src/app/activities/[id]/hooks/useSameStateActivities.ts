"use client";

import { useMemo } from "react";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlOpportunity, useGetOpportunitiesQuery } from "@/types/graphql";
import { presenterActivityCard } from "@/app/activities/data/presenter";
import { ActivityCard } from "@/app/activities/data/type";

export const useSameStateActivities = (opportunityId: string, stateCode: string) => {
  const { data, loading, error, refetch } = useGetOpportunitiesQuery({
    variables: {
      filter: {
        communityIds: [COMMUNITY_ID],
        stateCodes: [stateCode],
      },
    },
    skip: !opportunityId,
    nextFetchPolicy: "cache-and-network",
    fetchPolicy: "cache-first",
  });

  const sameStateActivities: ActivityCard[] = useMemo(() => {
    return (data?.opportunities.edges ?? [])
      .map((edge) => edge.node)
      .filter((node): node is GqlOpportunity => !!node)
      .map(presenterActivityCard);
  }, [data?.opportunities.edges]);

  return {
    sameStateActivities,
    loading,
    error,
    refetch,
  };
};
