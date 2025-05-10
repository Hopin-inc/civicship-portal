'use client';

import { Ticket } from '@/types/ticket';

/**
 * Transform wallet data from GraphQL to tickets array
 */
export const transformTickets = (data: any): Ticket[] => {
  return data?.user?.wallets?.edges?.[0]?.node?.tickets?.edges?.map((edge: any) => ({
    id: edge?.node?.id,
    status: edge?.node?.status,
    utilityId: edge?.node?.utility?.id,
    hostName: edge?.node?.ticketStatusHistories?.edges?.[0]?.node?.createdByUser?.name || '不明',
    hostImage: edge?.node?.ticketStatusHistories?.edges?.[0]?.node?.createdByUser?.image || '/placeholder.png',
    quantity: 1,
    createdByUser: edge?.node?.ticketStatusHistories?.edges?.[0]?.node?.createdByUser,
  })) || [];
};
