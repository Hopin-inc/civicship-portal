"use client";

import { useMemo } from "react";
import { COMMUNITY_ID } from "@/utils";
import { GqlOpportunity, useGetOpportunitiesQuery } from "@/types/graphql";
import { presenterActivityCard } from "@/app/activities/data/presenter";
import { ActivityCard } from "@/app/activities/data/type";

interface useSameStateActivitiesResult {
  sameStateActivities: ActivityCard[];
  loading: boolean;
  error: any;
}

export const useSameStateActivities = (
  opportunityId: string,
  stateCode: string,
): useSameStateActivitiesResult => {
  const { data, loading, error } = useGetOpportunitiesQuery({
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
  };
};
