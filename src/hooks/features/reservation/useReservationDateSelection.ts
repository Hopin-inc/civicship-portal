'use client';

import { useReservationDateSelectionController } from '@/hooks/features/reservation/useReservationDateSelectionController';
import type { TimeSlot, DateSection } from '@/transformers/opportunitySlot';

interface UseReservationDateSelectionProps {
  opportunityId: string;
  communityId: string;
}

/**
 * Custom hook for managing reservation date and guest selection
 * This is a backward-compatible wrapper around useReservationDateSelectionController
 */
export const useReservationDateSelection = (props: UseReservationDateSelectionProps) => {
  return useReservationDateSelectionController(props);
};

export type { TimeSlot, DateSection };
export default useReservationDateSelection;
