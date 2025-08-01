import {
  GqlOpportunityCategory,
  GqlPublishStatus,
  GqlSortDirection,
  useGetOpportunitiesQuery,
} from "@/types/graphql";
import { mapOpportunityCards, sliceActivitiesBySection } from "../activities/data/presenter";
import { useFeatureCheck } from "@/hooks/useFeatureCheck";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

export function useFetchFeaturedAndCarousel() {
  const shouldShowQuests = useFeatureCheck("quests");

  const { data, loading } = useGetOpportunitiesQuery({
    variables: {
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
      first: 10,
    },
    fetchPolicy: "cache-first",
  });
  const activityCards = mapOpportunityCards(data?.opportunities.edges ?? []);
  const { featuredCards, upcomingCards } = sliceActivitiesBySection(activityCards);
  return { featuredCards, upcomingCards, loading };
}
