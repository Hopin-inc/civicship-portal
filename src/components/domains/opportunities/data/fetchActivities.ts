import { apolloClient } from "@/lib/apollo";
import {
  GetOpportunitiesDocument,
  GqlGetOpportunitiesQuery,
  GqlGetOpportunitiesQueryVariables,
  GqlOpportunityCategory,
  GqlPublishStatus,
  GqlSortDirection,
} from "@/types/graphql";
import { mapOpportunityCards, sliceOpportunitiesBySection } from "./presenter";

export async function fetchFeaturedAndCarousel(communityId: string) {
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
  const activityCards = mapOpportunityCards((data.opportunities.edges as any) ?? []);
  const { featuredCards, upcomingCards } = sliceOpportunitiesBySection(activityCards);
  return { featuredCards, upcomingCards, loading };
}
