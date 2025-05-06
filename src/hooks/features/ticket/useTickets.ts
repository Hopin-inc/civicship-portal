'use client';

import { useTicketsQuery } from '@/hooks/features/ticket/useTicketsQuery';
import { transformTickets } from '@/transformers/ticket';
import { Ticket } from '@/types/ticket';

export interface UseTicketsResult {
  tickets: Ticket[];
  loading: boolean;
  error: any;
}

/**
 * Custom hook for fetching and managing tickets
 * This is a backward-compatible wrapper around useTicketsQuery
 */
export const useTickets = (): UseTicketsResult => {
  const { data, loading, error } = useTicketsQuery();
  
  const tickets = transformTickets(data);

  return {
    tickets,
    loading,
    error
  };
};
