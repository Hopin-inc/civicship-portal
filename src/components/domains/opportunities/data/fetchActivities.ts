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
import { getRuntimeCommunityId } from "@/lib/communities/communityIds";

export async function fetchFeaturedAndCarousel(communityId?: string) {
  // Use provided communityId or get it at runtime
  const effectiveCommunityId = communityId || getRuntimeCommunityId();
  const { data, loading } = await apolloClient.query<
    GqlGetOpportunitiesQuery,
    GqlGetOpportunitiesQueryVariables
  >({
    query: GetOpportunitiesDocument,
    variables: {
      filter: {
        communityIds: [effectiveCommunityId],
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
