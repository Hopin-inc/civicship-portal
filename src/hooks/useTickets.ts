'use client';

import { useQuery } from '@apollo/client';
import { GET_USER_WALLET } from '@/graphql/queries/user';
import { useAuth } from '@/contexts/AuthContext';
import { Ticket } from '@/types/ticket';

export interface UseTicketsResult {
  tickets: Ticket[];
  loading: boolean;
  error: any;
}

export const useTickets = (): UseTicketsResult => {
  const { user } = useAuth();
  
  const { data, loading, error } = useQuery(GET_USER_WALLET, {
    variables: { id: user?.id ?? '' },
    skip: !user?.id,
  });

  const tickets: Ticket[] = data?.user?.wallets?.edges?.[0]?.node?.tickets?.edges?.map((edge: any) => ({
    id: edge?.node?.id,
    status: edge?.node?.status,
    utilityId: edge?.node?.utility?.id,
    hostName: edge?.node?.ticketStatusHistories?.edges?.[0]?.node?.createdByUser?.name || '不明',
    hostImage: edge?.node?.ticketStatusHistories?.edges?.[0]?.node?.createdByUser?.image || '/placeholder.png',
    quantity: 1,
    createdByUser: edge?.node?.ticketStatusHistories?.edges?.[0]?.node?.createdByUser,
  })) || [];

  return {
    tickets,
    loading,
    error
  };
};
