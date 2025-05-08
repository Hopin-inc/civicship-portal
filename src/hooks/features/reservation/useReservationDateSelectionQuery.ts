'use client';

import { useOpportunity } from '@/hooks/features/activity/useOpportunity';

/**
 * Hook for fetching opportunity data for reservation date selection
 * @param opportunityId ID of the opportunity to fetch
 */
export const useReservationDateSelectionQuery = (opportunityId: string) => {
  return useOpportunity(opportunityId);
};
