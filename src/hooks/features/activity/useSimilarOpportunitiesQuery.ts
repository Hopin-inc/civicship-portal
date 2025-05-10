'use client';

import { useQuery } from "@apollo/client";
import { GET_OPPORTUNITIES } from "@/graphql/queries/opportunities";
import { Opportunity } from "@/types";
import { COMMUNITY_ID } from "@/utils";

interface UseSimilarOpportunitiesQueryProps {
  opportunityId: string;
}

export interface UseSimilarOpportunitiesQueryResult {
  similarOpportunities: Opportunity[];
  loading: boolean;
  error: any;
}

/**
 * Hook for fetching similar opportunities data from GraphQL
 * Responsible only for data fetching, not UI control
 */
export const useSimilarOpportunitiesQuery = ({
  opportunityId,
}: UseSimilarOpportunitiesQueryProps): UseSimilarOpportunitiesQueryResult => {
  const { data, loading, error } = useQuery(GET_OPPORTUNITIES, {
    variables: {
      similarFilter: {
        communityIds: [COMMUNITY_ID]
      },
    },
    skip: !opportunityId
  });

  return {
    similarOpportunities: data?.similar?.edges?.map(
      (edge: any) => edge.node
    ) as Opportunity[],
    loading,
    error,
  };
};
