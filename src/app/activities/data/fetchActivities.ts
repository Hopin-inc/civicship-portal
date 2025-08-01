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
import { COMMUNITY_ID } from "@/lib/communities/metadata";

export async function fetchFeaturedAndCarousel() {
  const { data, loading } = await apolloClient.query<
    GqlGetOpportunitiesQuery,
    GqlGetOpportunitiesQueryVariables
  >({
    query: GetOpportunitiesDocument,
    variables: {
      filter: {
        communityIds: [COMMUNITY_ID],
        category: GqlOpportunityCategory.Activity,
        publishStatus: [GqlPublishStatus.Public],
      },
      sort: {
        earliestSlotStartsAt: GqlSortDirection.Asc,
      },
      first: 10,
    },
    fetchPolicy: "cache-first",
  });
  const activityCards = mapOpportunityCards(data.opportunities.edges ?? []);
  const { featuredCards, upcomingCards } = sliceActivitiesBySection(activityCards);
  return { featuredCards, upcomingCards, loading };
}