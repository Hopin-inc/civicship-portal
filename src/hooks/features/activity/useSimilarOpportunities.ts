import { useGetOpportunitiesQuery } from "@/types/graphql";
import { Opportunity } from "@/types";
import { COMMUNITY_ID } from "@/utils";

interface UseSimilarOpportunitiesProps {
  opportunityId: string;
}

export const useSimilarOpportunities = ({
  opportunityId,
}: UseSimilarOpportunitiesProps) => {
  const { data, loading, error } = useGetOpportunitiesQuery({
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