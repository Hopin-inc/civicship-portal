import { GqlOpportunityCategory, GqlPublishStatus, useGetOpportunitiesQuery } from "@/types/graphql";

export const useAllActivities = () => {
  const { data, loading, error, fetchMore } = useGetOpportunitiesQuery({
    variables: {
      allFilter: {
        category: GqlOpportunityCategory.Activity,
        publishStatus: [GqlPublishStatus.Public],
      },
      first: 10,
    },
    fetchPolicy: 'network-only',
    nextFetchPolicy: 'cache-first',
  });

  const connection = data?.all || {
    edges: [],
    pageInfo: {
      hasNextPage: false,
      hasPreviousPage: false,
      startCursor: null,
      endCursor: null,
    },
    totalCount: 0
  };
  const endCursor = connection.pageInfo?.endCursor;
  const hasNextPage = connection.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage) return;

    await fetchMore({
      variables: {
        allFilter: {
          category: GqlOpportunityCategory.Activity,
          publishStatus: [GqlPublishStatus.Public],
        },
        first: 20,
        cursor: endCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;
        return {
          ...prev,
          all: {
            ...prev.all,
            edges: [...prev.all.edges, ...fetchMoreResult.all.edges],
            pageInfo: fetchMoreResult.all.pageInfo,
          },
        };
      },
    });
  };

  return {
    allActivities: connection,
    loading,
    error,
    fetchMore: handleFetchMore,
    hasNextPage,
  };
};
