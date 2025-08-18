import { presenterActivityDetail, presenterQuestDetail } from "@/components/domains/opportunities/data/presenter";
import { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlOpportunityCategory, GqlOpportunitySlotHostingStatus, GqlSortDirection, useGetOpportunityQuery } from "@/types/graphql";
import { useMemo } from "react";

// 基本のOpportunity詳細取得のみを担当
export const useOpportunityDetail = (id: string | undefined) => {
  const { data, loading, error, refetch } = useGetOpportunityQuery({
    variables: {
      id: id ?? "",
      permission: { communityId: COMMUNITY_ID },
      slotSort: { startsAt: GqlSortDirection.Asc },
      slotFilter: { hostingStatus: [GqlOpportunitySlotHostingStatus.Scheduled] },
    },
    skip: !id,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  const opportunity: ActivityDetail | QuestDetail | null = useMemo(() => {
    if(data?.opportunity && data.opportunity.category === GqlOpportunityCategory.Activity) 
      return presenterActivityDetail(data.opportunity as any);
    if(data?.opportunity && data.opportunity.category === GqlOpportunityCategory.Quest) 
      return presenterQuestDetail(data.opportunity as any);
    return data?.opportunity ? presenterActivityDetail(data.opportunity as any) : null;
  }, [data?.opportunity]);

  return { 
    opportunity, 
    loading, 
    error, 
    refetch,
    stateCode: data?.opportunity?.place?.city?.state?.code 
  };
}; 