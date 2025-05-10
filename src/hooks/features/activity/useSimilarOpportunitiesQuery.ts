'use client';

import { COMMUNITY_ID } from "@/utils";
import { GqlOpportunity, GqlOpportunityEdge, useGetOpportunitiesQuery } from "@/types/graphql";

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
  const { data, loading, error } = useGetOpportunitiesQuery({
    variables: {
      similarFilter: {
        communityIds: [COMMUNITY_ID]
      },
    },
    skip: !opportunityId
  });

  return {
    similarOpportunities: (data?.similar?.edges ?? [])
      .map((edge: GqlOpportunityEdge) => edge.node)
      .filter((node): node is GqlOpportunity => !!node),
    loading,
    error,
  };

};
