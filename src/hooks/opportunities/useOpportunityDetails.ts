import { GqlUser, Maybe } from "@/types/graphql";
import { useSameStateOpportunities } from "./useSameStateOpportunities";
import { useAvailableTickets } from "@/app/[communityId]/tickets/hooks/useAvailableTickets";
import { useFilterFutureSlots } from "./useFilterFutureSlots";
import { useSortedSlotsByStartsAt } from "./useSortedSlotsByStartsAt";
import { useOpportunityDetail } from "./useOpportunityDetail";

// 呼び出し側のインターフェースを維持
export const useOpportunityDetails = (id: string | undefined, user: Maybe<GqlUser> | undefined) => {
  const { opportunity, loading, error, refetch, stateCode } = useOpportunityDetail(id);

  const {
    sameStateOpportunities,
    loading: loadingSameState,
    error: errorSameState,
    refetch: refetchSameState,
  } = useSameStateOpportunities(id ?? "", stateCode ?? "");

  const availableTickets = useAvailableTickets(opportunity, user?.id);
  const futureSlots = useFilterFutureSlots(opportunity?.slots);
  const sortedSlots = useSortedSlotsByStartsAt(futureSlots);

  return {
    opportunity,
    sameStateOpportunities,
    availableTickets,
    sortedSlots,
    loading: loading || loadingSameState,
    error: error || errorSameState,
    refetch: async () => {
      await Promise.all([refetch(), refetchSameState()]);
    },
  };
};