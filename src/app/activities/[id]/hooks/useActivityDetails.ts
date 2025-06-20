"use client";

import { useAvailableTickets } from "@/app/tickets/hooks/useAvailableTickets";
import { useSortedSlotsByStartsAt } from "@/app/activities/[id]/hooks/useSortedSlotsByStartsAt";
import { OpportunityCard, OpportunityDetail } from "@/app/activities/data/type";
import { useOpportunityDetail } from "@/app/activities/[id]/hooks/useOpportunityDetail";
import { useSameStateActivities } from "@/app/activities/[id]/hooks/useSameStateActivities";
import { useAuth } from "@/contexts/AuthProvider";
import { IOpportunitySlot } from "@/app/reservation/data/type/opportunitySlot";
import { useFilterFutureSlots } from "./useFilterFutureSlots";

interface UseActivityDetailsResult {
  opportunity: OpportunityDetail | null;
  sameStateActivities: OpportunityCard[];
  availableTickets: number;
  sortedSlots: IOpportunitySlot[];
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
  const futureSlots = useFilterFutureSlots(opportunity?.slots);
  const sortedSlots = useSortedSlotsByStartsAt(futureSlots);

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
