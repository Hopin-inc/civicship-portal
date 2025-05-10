'use client';

import { useReservationConfirmController } from './useReservationConfirmController';

/**
 * Custom hook for managing reservation confirmation state and logic
 * This is a backward-compatible wrapper around useReservationConfirmController
 */
export const useReservationConfirm = (searchParams: {
  id: string | null;
  starts_at: string | null;
  guests: string | null;
  community_id: string | null;
}) => {
  return useReservationConfirmController(searchParams);
};

export default useReservationConfirm;
