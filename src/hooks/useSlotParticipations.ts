import { useQuery } from "@apollo/client";
import { useRef } from "react";
import { GET_OPPORTUNITY_SLOT_WITH_PARTICIPATIONS } from "@/graphql/experience/opportunitySlot/query";
import { GqlOpportunitySlot, GqlParticipation } from "@/types/graphql";

export interface UseSlotParticipationsResult {
  slot: any;
  participations: any[];
  loading: boolean;
  error: any;
  isLoadingMore: boolean;
}

export const useSlotParticipations = (slotId: string): UseSlotParticipationsResult => {
  const isLoadingMore = useRef(false);

  const { data, loading, error } = useQuery(GET_OPPORTUNITY_SLOT_WITH_PARTICIPATIONS, {
    variables: {
      id: slotId,
      first: 10,
    },
  });

  const slot: GqlOpportunitySlot = data?.opportunitySlot ?? {};
  const allParticipations: GqlParticipation[] =
    slot.reservations?.flatMap((reservation: any) => reservation.participations ?? []) ?? [];

  return {
    slot,
    participations: allParticipations,
    loading,
    error,
    isLoadingMore: isLoadingMore.current,
  };
};
