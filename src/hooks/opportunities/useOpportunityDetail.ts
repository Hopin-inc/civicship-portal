import { presenterActivityDetail, presenterQuestDetail } from "@/components/domains/opportunities/data/presenter";
import { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { GqlOpportunity, GqlOpportunityCategory, GqlOpportunitySlotHostingStatus, GqlSortDirection, useGetOpportunityQuery } from "@/types/graphql";
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
    if (!data?.opportunity) {
      return null;
    }
    const { opportunity: opp } = data;
    if (opp.category === GqlOpportunityCategory.Activity) {
      return presenterActivityDetail(opp as GqlOpportunity);
    }
    if (opp.category === GqlOpportunityCategory.Quest) {
      return presenterQuestDetail(opp as GqlOpportunity);
    }
    return null;
  }, [data?.opportunity]);

  return { 
    opportunity, 
    loading, 
    error, 
    refetch,
    stateCode: data?.opportunity?.place?.city?.state?.code 
  };
}; 