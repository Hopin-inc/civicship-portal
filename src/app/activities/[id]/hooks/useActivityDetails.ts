"use client";

import { useAvailableTickets } from "@/app/tickets/hooks/useAvailableTickets";
import { useSortedSlotsByStartsAt } from "@/app/activities/[id]/hooks/useSortedSlotsByStartsAt";
import { ActivityCard, ActivityDetail } from "@/app/activities/data/type";
import { useOpportunityDetail } from "@/app/activities/[id]/hooks/useOpportunityDetail";
import { useSameStateActivities } from "@/app/activities/[id]/hooks/useSameStateActivities";
import { useAuth } from "@/contexts/AuthContext";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";

interface UseActivityDetailsResult {
  opportunity: ActivityDetail | null;
  sameStateActivities: ActivityCard[];
  availableTickets: number;
  sortedSlots: ActivitySlot[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useActivityDetails = (id: string): UseActivityDetailsResult => {
  const { user } = useAuth();

  const {
    data,
    opportunity,
    loading: loadingOpportunity,
    error: errorOpportunity,
    refetch: refetchOpportunity,
  } = useOpportunityDetail(id);

  const stateCode = data?.opportunity?.place?.city?.state?.code;
  const {
    sameStateActivities,
    loading: loadingSameState,
    error: errorSameState,
    refetch: refetchSameState,
  } = useSameStateActivities(id, stateCode ?? "");

  const availableTickets = useAvailableTickets(opportunity, user?.id);
  const sortedSlots = useSortedSlotsByStartsAt(opportunity?.slots);

  const isLoading = loadingOpportunity || loadingSameState;
  const error = errorOpportunity || errorSameState;

  return {
    opportunity,
    sameStateActivities,
    availableTickets,
    sortedSlots,
    isLoading,
    error: error ?? null,
    refetch: async () => {
      await Promise.all([refetchOpportunity(), refetchSameState()]);
    },
  };
};
