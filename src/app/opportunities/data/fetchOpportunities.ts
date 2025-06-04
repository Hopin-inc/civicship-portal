import { apolloClient } from "@/lib/apollo";
import {
  GetOpportunitiesDocument,
  GqlGetOpportunitiesQuery,
  GqlGetOpportunitiesQueryVariables,
  GqlOpportunityCategory,
  GqlPublishStatus,
  GqlSortDirection,
} from "@/types/graphql";
import { mapOpportunityCards, sliceActivitiesBySection } from "@/app/activities/data/presenter";
import { presenterQuestCards, sliceQuestsBySection } from "@/app/quests/data/presenter";

export async function fetchFeaturedAndCarousel(category?: GqlOpportunityCategory) {
  try {
    const { data } = await apolloClient.query<
      GqlGetOpportunitiesQuery,
      GqlGetOpportunitiesQueryVariables
    >({
      query: GetOpportunitiesDocument,
      variables: {
        filter: {
          category,
          publishStatus: [GqlPublishStatus.Public],
        },
        sort: {
          earliestSlotStartsAt: category === GqlOpportunityCategory.Quest 
            ? GqlSortDirection.Desc 
            : GqlSortDirection.Asc,
        },
        first: category === GqlOpportunityCategory.Quest ? 20 : 10,
      },
      fetchPolicy: "no-cache",
    });

    if (category === GqlOpportunityCategory.Quest) {
      const questCards = presenterQuestCards(data.opportunities.edges ?? []);
      const { featuredCards, upcomingCards } = sliceQuestsBySection(questCards);
      return { featuredCards, upcomingCards };
    } else {
      const opportunityCards = mapOpportunityCards(data.opportunities.edges ?? []);
      const { featuredCards, upcomingCards } = sliceActivitiesBySection(opportunityCards);
      return { featuredCards, upcomingCards };
    }
  } catch (error) {
    console.error("Failed to fetch opportunities:", error);
    return {
      featuredCards: [],
      upcomingCards: [],
    };
  }
}
