import { useReservationComplete } from "@/app/reservation/complete/hooks/useReservationComplete";
import { useSameStateActivities } from "@/app/activities/[id]/hooks/useSameStateActivities";

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
    sameStateActivities,
    loading: sameStateLoading,
    error: sameStateError,
    refetch: sameStateRefetch,
  } = useSameStateActivities(opportunityId ?? "", stateCode);

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
    sameStateActivities,
    loading,
    error,
    refetch,
  };
}
