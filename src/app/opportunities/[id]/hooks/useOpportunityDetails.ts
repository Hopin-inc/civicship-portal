"use client";

import { useAvailableTickets } from "@/app/tickets/hooks/useAvailableTickets";
import { useSortedSlotsByStartsAt } from "./useSortedSlotsByStartsAt";
import { OpportunityCard, OpportunityDetail } from "../../data/type";
import { useOpportunityDetail } from "./useOpportunityDetail";
import { useSameStateOpportunities } from "./useSameStateOpportunities";
import { useAuth } from "@/contexts/AuthProvider";
import { ActivitySlot, QuestSlot } from "@/app/reservation/data/type/opportunitySlot";
import { useFilterFutureSlots } from "./useFilterFutureSlots";

interface UseOpportunityDetailsResult {
  opportunity: OpportunityDetail | null;
  sameStateOpportunities: OpportunityCard[];
  availableTickets: number;
  sortedSlots: (ActivitySlot | QuestSlot)[];
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

export const useOpportunityDetails = (id: string): UseOpportunityDetailsResult => {
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
    sameStateOpportunities,
    loading: loadingSameState,
    error: errorSameState,
    refetch: refetchSameState,
  } = useSameStateOpportunities(id, stateCode ?? "");

  const availableTickets = useAvailableTickets(opportunity, user?.id);
  const futureSlots = useFilterFutureSlots(opportunity?.slots || []);
  const sortedSlots = useSortedSlotsByStartsAt(futureSlots);

  const isLoading = loadingOpportunity || loadingSameState;
  const error = errorOpportunity || errorSameState;

  return {
    opportunity,
    sameStateOpportunities,
    availableTickets,
    sortedSlots,
    isLoading,
    error: error ?? null,
    refetch: async () => {
      await Promise.all([refetchOpportunity(), refetchSameState()]);
    },
  };
};
