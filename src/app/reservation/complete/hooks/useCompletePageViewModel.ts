import { useMemo } from "react";
import {
  presenterActivityCard,
  presenterReservationDateTimeInfo,
} from "@/app/activities/data/presenter";
import { useCompletePageDataRaw } from "./useCompletePageDataRaw";

export function useCompletePageViewModel(
  opportunityId: string | null,
  reservationId: string | null,
) {
  const {
    reservation,
    gqlOpportunity,
    gqlOpportunitySlot,
    sameStateActivities,
    loading,
    error,
    refetch,
  } = useCompletePageDataRaw(opportunityId, reservationId);

  const opportunity = useMemo(() => {
    return gqlOpportunity ? presenterActivityCard(gqlOpportunity) : null;
  }, [gqlOpportunity]);

  const dateTimeInfo = useMemo(() => {
    if (!reservation || !gqlOpportunity || !gqlOpportunitySlot) return null;
    return presenterReservationDateTimeInfo(gqlOpportunitySlot, gqlOpportunity, reservation);
  }, [reservation, gqlOpportunity, gqlOpportunitySlot]);

  return {
    reservation,
    opportunity,
    dateTimeInfo,
    sameStateActivities,
    loading,
    error,
    refetch,
  };
}
