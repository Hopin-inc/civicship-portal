'use client';

import { Opportunity } from "@/types";
import { useAvailableDatesQuery } from "@/hooks/features/activity/useAvailableDatesQuery";

/**
 * Hook for available dates
 * This is a wrapper around useAvailableDatesQuery
 * for backward compatibility
 */
export const useAvailableDates = (
  opportunity: Opportunity | null
): Array<{
  startsAt: string;
  endsAt: string;
  participants: number;
  price: number;
}> => {
  const { availableDates } = useAvailableDatesQuery(opportunity);
  return availableDates;
};
