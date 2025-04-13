import { useQuery } from "@apollo/client";
import { GET_OPPORTUNITIES } from "@/graphql/queries/opportunities";
import { Opportunity } from "@/types";

interface UseSimilarOpportunitiesProps {
  opportunityId: string;
  communityId: string;
}

export const useSimilarOpportunities = ({
  opportunityId,
  communityId,
}: UseSimilarOpportunitiesProps) => {
  const { data, loading, error } = useQuery(GET_OPPORTUNITIES, {
    variables: {
      similarFilter: {
        communityIds: [communityId]
      },
    },
    skip: !opportunityId || !communityId,
  });

  return {
    similarOpportunities: data?.similar?.edges?.map(
      (edge: any) => edge.node
    ) as Opportunity[],
    loading,
    error,
  };
}; 