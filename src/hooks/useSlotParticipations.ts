import { useRef } from "react";
import {
  GqlOpportunitySlot,
  GqlParticipation,
  GqlReservation,
  useGetOpportunitySlotWithParticipationsQuery,
} from "@/types/graphql";
import logger from "@/lib/logging";

export interface UseSlotParticipationsResult {
  slot: GqlOpportunitySlot | null | undefined;
  participations: GqlParticipation[];
  loading: boolean;
  error: Error | undefined;
  isLoadingMore: boolean;
}

export const useSlotParticipations = (slotId: string): UseSlotParticipationsResult => {
  const isLoadingMore = useRef(false);

  const { data, loading, error } = useGetOpportunitySlotWithParticipationsQuery({
    variables: {
      id: slotId,
    },
  });

  logger.debug("Slot participations data received", {
    hasData: !!data,
    slotId,
    hasOpportunitySlot: !!data?.opportunitySlot
  });

  const slot: GqlOpportunitySlot | null | undefined = data?.opportunitySlot ?? null;
  const allParticipations: GqlParticipation[] =
    slot?.reservations?.flatMap(
      (reservation: GqlReservation) => reservation.participations ?? [],
    ) ?? [];

  return {
    slot,
    participations: allParticipations,
    loading,
    error,
    isLoadingMore: isLoadingMore.current,
  };
};
