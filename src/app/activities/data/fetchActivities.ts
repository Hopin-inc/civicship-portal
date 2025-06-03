import { apolloClient } from "@/lib/apollo";
import {
  GetOpportunitiesDocument,
  GqlGetOpportunitiesQuery,
  GqlGetOpportunitiesQueryVariables,
  GqlOpportunitiesConnection,
  GqlOpportunityCategory,
  GqlPublishStatus,
} from "@/types/graphql";

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
