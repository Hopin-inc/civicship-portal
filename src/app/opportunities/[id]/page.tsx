import { notFound } from "next/navigation";
import { apolloClient } from "@/lib/apollo";
import {
  GetOpportunityDocument,
  GqlGetOpportunityQuery,
  GqlGetOpportunityQueryVariables,
  GqlOpportunity,
} from "@/types/graphql";
import { presenterActivityDetail } from "@/app/activities/data/presenter";
import { presenterQuestDetail } from "@/app/quests/data/presenter";
import { fetchQuestDetail } from "@/app/quests/[id]/data/fetchQuestDetail";
import { COMMUNITY_ID } from "@/utils";
import OpportunityDetailPageClient from "./components/OpportunityDetailPageClient";

interface OpportunityDetailPageProps {
  params: { id: string };
}

async function fetchOpportunityDetail(id: string): Promise<GqlOpportunity> {
  const { data } = await apolloClient.query<
    GqlGetOpportunityQuery,
    GqlGetOpportunityQueryVariables
  >({
    query: GetOpportunityDocument,
    variables: { id },
    fetchPolicy: "no-cache",
  });

  if (!data.opportunity) {
    notFound();
  }

  return data.opportunity;
}

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const opportunity = await fetchOpportunityDetail(params.id);

  if (opportunity.category === "ACTIVITY") {
    const activityDetail = presenterActivityDetail(opportunity);
    return <OpportunityDetailPageClient opportunityDetail={activityDetail} type="activity" />;
  } else if (opportunity.category === "QUEST") {
    const questDetail = await fetchQuestDetail(params.id, COMMUNITY_ID);
    return <OpportunityDetailPageClient opportunityDetail={questDetail} type="quest" />;
  }

  notFound();
}
