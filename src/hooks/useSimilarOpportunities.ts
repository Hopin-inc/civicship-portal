import { useQuery } from "@apollo/client";
import { GET_OPPORTUNITIES } from "@/graphql/queries/opportunities";
import { Opportunity } from "@/types";
import { COMMUNITY_ID } from "@/utils";

interface UseSimilarOpportunitiesProps {
  opportunityId: string;
}

export const useSimilarOpportunities = ({
  opportunityId,
}: UseSimilarOpportunitiesProps) => {
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