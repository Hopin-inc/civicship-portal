import {
  GqlOpportunityCategory,
  GqlPublishStatus,
  GqlSortDirection,
  useGetOpportunitiesQuery,
} from "@/types/graphql";
import { mapOpportunityCards, sliceOpportunitiesBySection } from "@/components/domains/opportunities/data/presenter";
import { useFeatureCheck } from "@/hooks/useFeatureCheck";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

export function useFetchFeedOpportunities() {
  const shouldShowQuests = useFeatureCheck("quests");

  const { data, loading } = useGetOpportunitiesQuery({
    variables: {
      includeSlot: true,
      filter: {
        communityIds: [COMMUNITY_ID],
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
      first: 30,
    },
    fetchPolicy: "cache-first",
  });
  const opportunityCards = mapOpportunityCards(data?.opportunities.edges ?? []);
  const { featuredCards, upcomingCards } = sliceOpportunitiesBySection(opportunityCards);
  return { featuredCards, upcomingCards, loading };
}
