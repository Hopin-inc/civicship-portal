'use client';

import { useQuery } from "@apollo/client";
import { GET_OPPORTUNITIES } from "@/graphql/queries/opportunities";
import { COMMUNITY_ID } from "@/utils";
import { GqlOpportunity } from "@/types/graphql";

interface UseSimilarOpportunitiesQueryProps {
  opportunityId: string;
}

export interface UseSimilarOpportunitiesQueryResult {
  similarOpportunities: GqlOpportunity[];
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
