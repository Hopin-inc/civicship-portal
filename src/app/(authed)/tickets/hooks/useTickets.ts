"use client";

import { useAuthCompat as useAuth } from "@/hooks/auth/useAuthCompat";
import { transformTickets } from "@/app/(authed)/tickets/data/presenter";
import { TTicket } from "@/app/(authed)/tickets/data/type";
import { GqlTicketStatus, useGetTicketsQuery } from "@/types/graphql";

export interface UseTicketsResult {
  tickets: TTicket[];
  loading: boolean;
  error: any;
  refetch: () => void;
}

export const useTickets = (): UseTicketsResult => {
  const { user } = useAuth();

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
