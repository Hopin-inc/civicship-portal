import { useSameStateOpportunities } from "./useSameStateOpportunities";
import { useFilterFutureSlots } from "./useFilterFutureSlots";
import { useSortedSlotsByStartsAt } from "./useSortedSlotsByStartsAt";
import { useOpportunityDetail } from "./useOpportunityDetail";

export const useOpportunityDetails = (id: string | undefined) => {
  const { opportunity, loading, error, refetch, stateCode } = useOpportunityDetail(id);

  const {
    sameStateOpportunities,
    loading: loadingSameState,
    error: errorSameState,
    refetch: refetchSameState,
  } = useSameStateOpportunities(id ?? "", stateCode ?? "");

  // const availableTickets = useAvailableTickets(opportunity, user?.id);
  const futureSlots = useFilterFutureSlots(opportunity?.slots);
  const sortedSlots = useSortedSlotsByStartsAt(futureSlots);

  return {
    opportunity,
    sameStateOpportunities,
    // availableTickets,
    sortedSlots,
    loading: loading || loadingSameState,
    error: error || errorSameState,
    refetch: async () => {
      await Promise.all([refetch(), refetchSameState()]);
    },
  };
};
