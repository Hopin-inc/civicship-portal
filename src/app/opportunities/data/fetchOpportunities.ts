import { apolloClient } from "@/lib/apollo";
import {
  GetOpportunitiesDocument,
  GqlGetOpportunitiesQuery,
  GqlGetOpportunitiesQueryVariables,
  GqlOpportunityCategory,
  GqlPublishStatus,
  GqlSortDirection,
} from "@/types/graphql";
import { mapOpportunityCards, sliceActivitiesBySection } from "./presenter";


export async function fetchFeaturedAndCarousel() {
  try {
    const { data } = await apolloClient.query<
      GqlGetOpportunitiesQuery,
      GqlGetOpportunitiesQueryVariables
    >({
      query: GetOpportunitiesDocument,
      variables: {
        filter: {
          publishStatus: [GqlPublishStatus.Public],
        },
        sort: {
          earliestSlotStartsAt: GqlSortDirection.Asc,
        },
        first: 20,
      },
      fetchPolicy: "no-cache",
    });

    const opportunityCards = mapOpportunityCards(data.opportunities.edges ?? []);
    const { featuredCards, upcomingCards } = sliceActivitiesBySection(opportunityCards);
    return { featuredCards, upcomingCards };
  } catch (error) {
    console.error("Failed to fetch opportunities:", error);
    return {
      featuredCards: [],
      upcomingCards: [],
    };
  }
}
