"use client";

import { useMemo } from "react";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlOpportunity, useGetOpportunitiesQuery } from "@/types/graphql";
import { presenterActivityCard } from "@/components/domains/opportunities/data/presenter";
import { ActivityCard, QuestCard } from "@/components/domains/opportunities/types";

export const useSameStateOpportunities = (opportunityId: string, stateCode: string) => {
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

  const sameStateOpportunities: ActivityCard[] | QuestCard[] = useMemo(() => {
    return (data?.opportunities.edges ?? [])
      .map((edge) => edge.node)
      .filter((node): node is GqlOpportunity => !!node)
      .map(presenterActivityCard);
  }, [data?.opportunities.edges]);

  return {
    sameStateOpportunities,
    loading,
    error,
    refetch,
  };
};
