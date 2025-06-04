import { apolloClient } from "@/lib/apollo";
import {
  GetOpportunityDocument,
  GqlGetOpportunityQuery,
  GqlGetOpportunityQueryVariables,
} from "@/types/graphql";
import { presenterQuestDetail } from "../../data/presenter";
import { QuestDetail } from "@/app/activities/data/type";

export async function fetchQuestDetail(
  id: string,
  communityId?: string,
): Promise<QuestDetail | null> {
  try {
    const { data } = await apolloClient.query<
      GqlGetOpportunityQuery,
      GqlGetOpportunityQueryVariables
    >({
      query: GetOpportunityDocument,
      variables: {
        id,
        communityId,
      },
      fetchPolicy: "no-cache",
    });

    if (!data.opportunity) {
      return null;
    }

    return presenterQuestDetail(data.opportunity);
  } catch (error) {
    console.error("Failed to fetch quest detail:", error);
    return null;
  }
}
