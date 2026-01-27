import { useReservationComplete } from "@/app/[communityId]/reservation/complete/hooks/useReservationComplete";
import { useSameStateOpportunities } from "@/hooks/opportunities/useSameStateOpportunities";

export function useCompletePageDataRaw(opportunityId: string | null, reservationId: string | null) {
  const {
    reservation,
    gqlOpportunity,
    gqlOpportunitySlot,
    gqlArticle,
    loading: reservationLoading,
    error: reservationError,
    refetch: reservationRefetch,
  } = useReservationComplete(reservationId);

  const stateCode = gqlOpportunity?.place?.city?.state?.code ?? "";
  const {
    sameStateOpportunities,
    loading: sameStateLoading,
    error: sameStateError,
    refetch: sameStateRefetch,
  } = useSameStateOpportunities(opportunityId ?? "", stateCode);

  const loading = reservationLoading || sameStateLoading;
  const error = reservationError ?? sameStateError ?? null;

  const refetch = async () => {
    await Promise.all([reservationRefetch(), sameStateRefetch()]);
  };

  return {
    reservation,
    gqlOpportunity,
    gqlOpportunitySlot,
    gqlArticle,
    sameStateOpportunities,
    loading,
    error,
    refetch,
  };
}
