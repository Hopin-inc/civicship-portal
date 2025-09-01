"use client";

import { useAuthStore } from "@/stores/auth-store";
import { transformTickets } from "@/app/tickets/data/presenter";
import { TTicket } from "@/app/tickets/data/type";
import { GqlTicketStatus, useGetTicketsQuery } from "@/types/graphql";

export interface UseTicketsResult {
  tickets: TTicket[];
  loading: boolean;
  error: any;
  refetch: () => void;
}

export const useTickets = (): UseTicketsResult => {
  const { currentUser } = useAuthStore();
  const user = currentUser;

  const { data, loading, error, refetch } = useGetTicketsQuery({
    variables: { filter: { ownerId: user?.id, status: GqlTicketStatus.Available } },
    skip: !user?.id,
  });

  const tickets = transformTickets(data);

  return {
    tickets,
    loading,
    error,
    refetch,
  };
};
