"use client";

import { useAuth } from "@/contexts/AuthContext";
import { transformTickets } from "@/app/tickets/data/presenter";
import { Ticket } from "@/app/tickets/data/type";
import { useGetUserWalletQuery } from "@/types/graphql";

export interface UseTicketsResult {
  tickets: Ticket[];
  loading: boolean;
  error: any;
}

export const useTickets = (): UseTicketsResult => {
  const { user } = useAuth();

  const { data, loading, error } = useGetUserWalletQuery({
    variables: { id: user?.id ?? "" },
    skip: !user?.id,
  });

  const tickets = transformTickets(data);

  return {
    tickets,
    loading,
    error,
  };
};
