"use client";

import { useMemo } from "react";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import {
  GqlOpportunityCategory,
  GqlOpportunitySlotHostingStatus,
  GqlSortDirection,
  useGetOpportunityQuery,
} from "@/types/graphql";
import { presenterActivityDetail, presenterQuestDetail } from "@/components/domains/opportunity/data/presenter";
import { ActivityDetail, QuestDetail } from "@/components/domains/opportunity/types";

export const useOpportunityDetail = (id: string) => {
  const { data, loading, error, refetch } = useGetOpportunityQuery({
    variables: {
      id,
      permission: { communityId: COMMUNITY_ID },
      slotSort: { startsAt: GqlSortDirection.Asc },
      slotFilter: { hostingStatus: [GqlOpportunitySlotHostingStatus.Scheduled] },
    },
    skip: !id,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  const opportunity: ActivityDetail | QuestDetail | null = useMemo(() => {
    if(data?.opportunity && data.opportunity.category === GqlOpportunityCategory.Activity) return presenterActivityDetail(data.opportunity);
    if(data?.opportunity && data.opportunity.category === GqlOpportunityCategory.Quest) return presenterQuestDetail(data.opportunity);
    return data?.opportunity ? presenterActivityDetail(data.opportunity) : null;
  }, [data?.opportunity]);

  return {
    data,
    opportunity,
    loading,
    error,
    refetch,
  };
};
