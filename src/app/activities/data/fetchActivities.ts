import { apolloClient } from "@/lib/apollo";
import {
  GetOpportunitiesDocument,
  GqlGetOpportunitiesQuery,
  GqlGetOpportunitiesQueryVariables,
  GqlOpportunitiesConnection,
  GqlOpportunityCategory,
  GqlPublishStatus,
} from "@/types/graphql";
import { mapOpportunityCards, sliceActivitiesBySection } from "./presenter";

export async function fetchInitialActivities(): Promise<GqlOpportunitiesConnection> {
  const { data } = await apolloClient.query<
    GqlGetOpportunitiesQuery,
    GqlGetOpportunitiesQueryVariables
  >({
    query: GetOpportunitiesDocument,
    variables: {
      filter: {
        category: GqlOpportunityCategory.Activity,
        publishStatus: [GqlPublishStatus.Public],
      },
      first: 5,
    },
    fetchPolicy: "no-cache",
  });
  return data.opportunities;
}

// 新規追加: FeaturedSectionとCarouselSection用のデータのみ取得
export async function fetchFeaturedAndCarousel() {
  const { data } = await apolloClient.query<
    GqlGetOpportunitiesQuery,
    GqlGetOpportunitiesQueryVariables
  >({
    query: GetOpportunitiesDocument,
    variables: {
      filter: {
        category: GqlOpportunityCategory.Activity,
        publishStatus: [GqlPublishStatus.Public],
      },
      first: 10,
    },
    fetchPolicy: "no-cache",
  });
  const activityCards = mapOpportunityCards(data.opportunities.edges ?? []);
  const { featuredCards, upcomingCards } = sliceActivitiesBySection(activityCards);
  return { featuredCards, upcomingCards };
}
