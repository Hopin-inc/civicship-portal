import { apolloClient } from "@/lib/apollo";
import {
  GetOpportunitiesDocument,
  GqlGetOpportunitiesQuery,
  GqlGetOpportunitiesQueryVariables,
  GqlOpportunityCategory,
  GqlPublishStatus,
  GqlSortDirection,
} from "@/types/graphql";
import { presenterQuestCards, sliceQuestsBySection } from "./presenter";

export async function fetchFeaturedAndCarousel() {
  try {
    const { data } = await apolloClient.query<
      GqlGetOpportunitiesQuery,
      GqlGetOpportunitiesQueryVariables
    >({
      query: GetOpportunitiesDocument,
      variables: {
        filter: {
          category: GqlOpportunityCategory.Quest,
          publishStatus: [GqlPublishStatus.Public],
        },
        sort: {
          earliestSlotStartsAt: GqlSortDirection.Desc,
        },
        first: 20,
      },
      fetchPolicy: "no-cache",
    });

    const questCards = presenterQuestCards(data.opportunities.edges ?? []);
    const { featuredCards, upcomingCards } = sliceQuestsBySection(questCards);

    return {
      featuredCards,
      upcomingCards,
    };
  } catch (error) {
    console.error("Failed to fetch quests:", error);
    return {
      featuredCards: [],
      upcomingCards: [],
    };
  }
}
