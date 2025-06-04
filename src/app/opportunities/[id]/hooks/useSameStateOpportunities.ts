"use client";

import { useMemo } from "react";
import { COMMUNITY_ID } from "@/utils";
import { GqlOpportunity, useGetOpportunitiesQuery } from "@/types/graphql";
import { presenterOpportunityCard } from "../../data/presenter";
import { OpportunityCard } from "../../data/type";

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

  const sameStateOpportunities: OpportunityCard[] = useMemo(() => {
    return (data?.opportunities.edges ?? [])
      .map((edge) => edge.node)
      .filter((node): node is GqlOpportunity => !!node)
      .map(presenterOpportunityCard);
  }, [data?.opportunities.edges]);

  return {
    sameStateOpportunities,
    loading,
    error,
    refetch,
  };
};
