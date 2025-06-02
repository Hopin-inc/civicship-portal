"use client";

import { useMemo } from "react";
import { COMMUNITY_ID } from "@/utils";
import { GqlOpportunity, useGetOpportunitiesQuery } from "@/types/graphql";
import { presenterActivityCard } from "@/app/activities/data/presenter";
import { ActivityCard } from "@/app/activities/data/type";
import clientLogger from "@/lib/logging/client";

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
    onCompleted: (data) => {
      clientLogger.info("Same state activities query completed", {
        component: "useSameStateActivities",
        operation: "getOpportunities",
        opportunityId,
        stateCode,
        resultCount: data?.opportunities?.edges?.length || 0
      });
    },
    onError: (error) => {
      clientLogger.error("Same state activities query failed", {
        component: "useSameStateActivities",
        operation: "getOpportunities", 
        opportunityId,
        stateCode,
        error: error.message
      });
    }
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
