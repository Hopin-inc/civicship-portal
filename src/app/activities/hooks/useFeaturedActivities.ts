import { GqlOpportunityCategory, GqlPublishStatus, useGetOpportunitiesQuery } from "@/types/graphql";

export const useFeaturedActivities = () => {
  const { data, loading, error } = useGetOpportunitiesQuery({
    variables: {
      featuredFilter: {
        category: GqlOpportunityCategory.Activity,
        publishStatus: [GqlPublishStatus.Public],
      },
      first: 5,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  return {
    featuredActivities: data?.featured || {
      edges: [],
      pageInfo: {
        hasNextPage: false,
        hasPreviousPage: false,
        startCursor: null,
        endCursor: null,
      },
      totalCount: 0 },
    loading,
    error
  };
};
