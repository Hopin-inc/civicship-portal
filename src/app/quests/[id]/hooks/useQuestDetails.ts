"use client";

import { useQuestDetail } from "./useQuestDetail";
import { QuestDetail } from "@/app/activities/data/type";

export interface UseQuestDetailsResult {
  questDetail: QuestDetail | null | undefined;
  loading: boolean;
  error: any;
  refetch: () => void;
}

export const useQuestDetails = (
  id: string,
  communityId: string,
  initialData?: QuestDetail | null,
): UseQuestDetailsResult => {
  const { opportunity, loading, error, refetch } = useQuestDetail(id, communityId);

  const questDetail = opportunity ? opportunity : initialData;

  return {
    questDetail,
    loading,
    error,
    refetch,
  };
};
