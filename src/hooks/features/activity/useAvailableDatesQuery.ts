'use client';

import { useMemo } from "react";
import { Opportunity } from "@/types";

export interface UseAvailableDatesQueryResult {
  availableDates: Array<{
    startsAt: string;
    endsAt: string;
    participants: number;
    price: number;
  }>;
}

/**
 * Hook for fetching available dates from an opportunity
 * Responsible only for data transformation, not UI control
 */
export const useAvailableDatesQuery = (
  opportunity: Opportunity | null
): UseAvailableDatesQueryResult => {
  const availableDates = useMemo(() => {
    if (!opportunity?.slots?.edges) return [];

    return opportunity.slots.edges
      .map(edge => ({
        startsAt: new Date(edge.node.startsAt).toISOString(),
        endsAt: new Date(edge.node.endsAt).toISOString(),
        participants: edge.node.participations?.edges?.length || 0,
        price: opportunity.feeRequired || 0,
      }))
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [opportunity]);

  return {
    availableDates
  };
};
