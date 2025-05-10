'use client';

import { useQuery } from "@apollo/client";
import { COMMUNITY_ID } from "@/utils";
import { GET_OPPORTUNITIES } from "@/graphql/experience/opportunity/query";
import { ActivityCard } from "@/types/opportunity";

interface UseSimilarOpportunitiesQueryProps {
  opportunityId: string;
}

export interface UseSimilarOpportunitiesQueryResult {
  similarOpportunities: ActivityCard[];
  loading: boolean;
  error: any;
}

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
    ),
    loading,
    error,
  };
};
