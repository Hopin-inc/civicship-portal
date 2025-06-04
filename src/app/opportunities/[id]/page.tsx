import { notFound } from "next/navigation";
import { apolloClient } from "@/lib/apollo";
import {
  GetOpportunityDocument,
  GqlGetOpportunityQuery,
  GqlGetOpportunityQueryVariables,
  GqlOpportunity,
  GqlCheckCommunityPermissionInput,
} from "@/types/graphql";
import { presenterOpportunityDetail } from "../data/presenter";
import { COMMUNITY_ID } from "@/utils";
import OpportunityDetailPageClient from "./components/OpportunityDetailPageClient";

interface OpportunityDetailPageProps {
  params: { id: string };
}

async function fetchOpportunityDetail(id: string): Promise<GqlOpportunity> {
  const permission: GqlCheckCommunityPermissionInput = {
    communityId: COMMUNITY_ID,
  };

  const { data } = await apolloClient.query<
    GqlGetOpportunityQuery,
    GqlGetOpportunityQueryVariables
  >({
    query: GetOpportunityDocument,
    variables: { id, permission },
    fetchPolicy: "no-cache",
  });

  if (!data.opportunity) {
    notFound();
  }

  return data.opportunity;
}

export default async function OpportunityDetailPage({ params }: OpportunityDetailPageProps) {
  const opportunity = await fetchOpportunityDetail(params.id);

  const opportunityDetail = presenterOpportunityDetail(opportunity);
  const type = opportunity.category === "ACTIVITY" ? "activity" : "quest";
  
  return <OpportunityDetailPageClient opportunityDetail={opportunityDetail} type={type} />;
}
