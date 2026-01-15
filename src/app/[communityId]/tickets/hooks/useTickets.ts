"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthProvider";
import { transformTickets } from "@/app/[communityId]/tickets/data/presenter";
import { TTicket } from "@/app/[communityId]/tickets/data/type";
import { GqlTicketStatus, useGetTicketsQuery } from "@/types/graphql";

export interface UseTicketsResult {
  tickets: TTicket[];
  loading: boolean;
  error: any;
  refetch: () => void;
}

export const useTickets = (): UseTicketsResult => {
  const params = useParams<{ communityId: string }>();
  const communityId = params.communityId;
  const { user } = useAuth();

  const { data, loading, error, refetch } = useGetTicketsQuery({
    variables: { filter: { ownerId: user?.id, status: GqlTicketStatus.Available } },
    skip: !user?.id,
  });

  const tickets = transformTickets(data, communityId);

  return {
    tickets,
    loading,
    error,
    refetch,
  };
};
