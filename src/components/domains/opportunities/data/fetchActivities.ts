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
import { getCommunityIdFromEnv } from "@/lib/communities/config";

export async function fetchFeaturedAndCarousel() {
  const communityId = getCommunityIdFromEnv();
  const { data, loading } = await apolloClient.query<
    GqlGetOpportunitiesQuery,
    GqlGetOpportunitiesQueryVariables
  >({
    query: GetOpportunitiesDocument,
    variables: {
      filter: {
        communityIds: [communityId],
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
