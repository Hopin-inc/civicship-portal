'use client';

import { useTicketDetailController } from './useTicketDetailController';
import { TicketDetail } from './useTicketDetailQuery';

/**
 * Custom hook for fetching and managing ticket details
 * This is a backward-compatible wrapper around useTicketDetailController
 */
export const useTicketDetail = (ticketId: string) => {
  return useTicketDetailController(ticketId);
};

export default useTicketDetail;
