'use client';

import { useMemo } from "react";
import { GqlOpportunity } from "@/types/graphql";

export interface UseAvailableDatesQueryResult {
  availableDates: Array<{
    startsAt: string;
    endsAt: string;
    participants: number;
    price: number;
  }>;
}

export const useAvailableDatesQuery = (
  opportunity: GqlOpportunity | null
): UseAvailableDatesQueryResult => {
  const availableDates = useMemo(() => {
    if (!opportunity?.slots) return [];

    return opportunity.slots
      .map(slot => ({
        startsAt: new Date(slot.startsAt).toISOString(),
        endsAt: new Date(slot.endsAt).toISOString(),
        participants:  slot.reservations?.flatMap(r => r.participations ?? []).length ?? 0,
        price: opportunity.feeRequired || 0,
      }))
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [opportunity]);

  return {
    availableDates
  };
};
