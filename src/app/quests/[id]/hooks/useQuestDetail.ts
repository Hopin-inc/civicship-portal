"use client";

import { useGetOpportunityQuery } from "@/types/graphql";
import { presenterQuestDetail } from "../../data/presenter";
import { QuestDetail } from "@/app/activities/data/type";

export interface UseQuestDetailResult {
  opportunity: QuestDetail | null;
  loading: boolean;
  error: any;
  refetch: () => void;
}

export const useQuestDetail = (id: string, communityId: string): UseQuestDetailResult => {
  const { data, loading, error, refetch } = useGetOpportunityQuery({
    variables: {
      id,
      permission: { communityId },
    },
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const opportunity = data?.opportunity ? presenterQuestDetail(data.opportunity) : null;

  return {
    opportunity,
    loading,
    error,
    refetch,
  };
};
