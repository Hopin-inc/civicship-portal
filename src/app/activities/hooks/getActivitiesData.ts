import { apolloClient } from "@/lib/apollo";
import {
  GetOpportunitiesDocument,
  GqlGetOpportunitiesQuery,
  GqlGetOpportunitiesQueryVariables,
  GqlOpportunityCategory,
  GqlPublishStatus,
} from "@/types/graphql";
import { mapOpportunityCards, sliceActivitiesBySection } from "@/app/activities/data/presenter";
import { ActivityCard } from "@/app/activities/data/type";

export async function getActivitiesData(): Promise<{
  featuredCards: ActivityCard[];
}> {
  try {
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
        first: 20,
      },
    });

    if (!data?.opportunities?.edges?.length) {
      return { featuredCards: [] };
    }

    const activityCards = mapOpportunityCards(data.opportunities.edges);
    const { featuredCards } = sliceActivitiesBySection(activityCards);

    return { featuredCards };
  } catch (error) {
    console.error('Failed to fetch activities data:', error);
    return { featuredCards: [] };
  }
}
