import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
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
    const httpLink = createHttpLink({
      uri: process.env.NEXT_PUBLIC_API_ENDPOINT || `${process.env.APP_BASE_URL}/graphql` || "https://dev.neo88.app/graphql",
      headers: {
        "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID || "",
      },
    });

    const serverClient = new ApolloClient({
      link: httpLink,
      cache: new InMemoryCache(),
      ssrMode: true,
    });

    const { data } = await serverClient.query<
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
