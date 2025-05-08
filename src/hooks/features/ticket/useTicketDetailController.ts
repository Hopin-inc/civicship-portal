'use client';

import { toast } from 'sonner';
import { useTicketDetailQuery } from '@/hooks/features/ticket/useTicketDetailQuery';

/**
 * Controller hook for managing ticket detail UI state
 */
export const useTicketDetailController = (ticketId: string) => {
  const { data: ticketDetail, isLoading, error } = useTicketDetailQuery(ticketId);

  const findRelatedOpportunities = async () => {
    toast.success('関連する体験を探しています...');
  };

  return {
    isLoading,
    error,
    ticketDetail,
    findRelatedOpportunities
  };
};
