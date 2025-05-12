import { GqlOpportunityCategory, GqlPublishStatus, useGetOpportunitiesQuery } from "@/types/graphql";

export const useUpcomingActivities = () => {
  const { data, loading, error } = useGetOpportunitiesQuery({
    variables: {
      upcomingFilter: {
        category: GqlOpportunityCategory.Activity,
        publishStatus: [GqlPublishStatus.Public],
      },
      first: 5,
    },
    skip: false,
  });

  return {
    upcomingActivities: data?.upcoming || {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
      totalCount: 0
    },
    loading,
    error
  };
};
