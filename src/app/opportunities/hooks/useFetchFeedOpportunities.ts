import {
  GqlOpportunitiesConnection,
  GqlOpportunityCategory,
  GqlPublishStatus,
  GqlSortDirection,
  useGetOpportunitiesQuery,
} from "@/types/graphql";
import { mapOpportunityCards, sliceOpportunitiesBySection } from "@/components/domains/opportunities/data/presenter";
import { useFeatureCheck } from "@/hooks/useFeatureCheck";
import { useCommunityId } from "@/contexts/CommunityContext";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

const fallbackConnection: GqlOpportunitiesConnection = {
  edges: [],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
    startCursor: null,
    endCursor: null,
  },
  totalCount: 0,
};

export function useFetchFeedOpportunities() {
  const communityId = useCommunityId();
  const shouldShowQuests = useFeatureCheck("quests");

  const { data, loading, fetchMore, refetch, error } = useGetOpportunitiesQuery({
    variables: {
      includeSlot: true,
      filter: {
        communityIds: [communityId],
        or: [
          {
            category: GqlOpportunityCategory.Activity,
            publishStatus: [GqlPublishStatus.Public],
          },
          ...(shouldShowQuests
            ? [
                {
                  category: GqlOpportunityCategory.Quest,
                  publishStatus: [GqlPublishStatus.Public],
                },
              ]
            : []),
        ],
      },
      sort: {
        earliestSlotStartsAt: GqlSortDirection.Asc,
      },
      first: 20,
    },
    fetchPolicy: "cache-first",
  });

  const opportunities = data?.opportunities ?? fallbackConnection;
  const endCursor = opportunities.pageInfo?.endCursor;
  const hasNextPage = opportunities.pageInfo?.hasNextPage ?? false;

  const handleFetchMore = async () => {
    if (!hasNextPage) return;

    await fetchMore({
      variables: {
        filter: {
          communityIds: [communityId],
          category: GqlOpportunityCategory.Activity,
          publishStatus: [GqlPublishStatus.Public],
        },
        sort: {
          earliestSlotStartsAt: GqlSortDirection.Asc,
        },
        cursor: endCursor,
        first: 10,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || !prev.opportunities || !fetchMoreResult.opportunities) {
          return prev;
        }

        return {
          ...prev,
          opportunities: {
            ...prev.opportunities,
            edges: [
              ...new Map(
                [...prev.opportunities.edges, ...fetchMoreResult.opportunities.edges].map(
                  (edge) => [edge?.node?.id, edge],
                ),
              ).values(),
            ],
            pageInfo: fetchMoreResult.opportunities.pageInfo,
          },
        };
      },
    });
  };

  const loadMoreRef = useInfiniteScroll({
    hasMore: hasNextPage,
    isLoading: loading,
    onLoadMore: handleFetchMore,
  });

  const opportunityCards = mapOpportunityCards(data?.opportunities.edges ?? []);
  const { featuredCards, upcomingCards } = sliceOpportunitiesBySection(opportunityCards);
  return {
    featuredCards,
    upcomingCards,
    loading,
    loadMoreRef,
    opportunities,
    refetch,
    error,
  };
}
