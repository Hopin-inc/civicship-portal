"use client";

import { useMemo } from "react";
import { useCommunityId } from "@/contexts/CommunityContext";
import { GqlOpportunity, useGetOpportunitiesQuery } from "@/types/graphql";
import { presenterActivityCard } from "@/components/domains/opportunities/data/presenter";
import { ActivityCard, QuestCard } from "@/components/domains/opportunities/types";

export const useSameStateOpportunities = (opportunityId: string, stateCode: string) => {
  const communityId = useCommunityId();
  const { data, loading, error, refetch } = useGetOpportunitiesQuery({
    variables: {
      filter: {
        communityIds: [communityId],
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
