'use client';

import { COMMUNITY_ID } from "@/utils";
import { GqlOpportunity, GqlOpportunityEdge, useGetOpportunitiesQuery } from "@/types/graphql";

interface UseSimilarOpportunitiesQueryProps {
  opportunityId: string;
  cityCode: string;
}

export interface UseSimilarOpportunitiesQueryResult {
  similarOpportunities: GqlOpportunity[];
  loading: boolean;
  error: any;
}

export const useSimilarOpportunitiesQuery = ({
  opportunityId,
  cityCode
}: UseSimilarOpportunitiesQueryProps): UseSimilarOpportunitiesQueryResult => {
  const { data, loading, error } = useGetOpportunitiesQuery({
    variables: {
      filter: {
        communityIds: [COMMUNITY_ID],
        cityCodes: [cityCode]
      },
    },
    skip: !opportunityId
  });
  const similarOpportunities = (data?.opportunities.edges ?? [])
    .map((edge) => edge.node)
    .filter((node): node is GqlOpportunity => !!node);

  return {
    similarOpportunities,
    loading,
    error,
  };

};
