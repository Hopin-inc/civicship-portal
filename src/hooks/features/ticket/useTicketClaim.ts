'use client';

import { useTicketClaimController } from './useTicketClaimController';
import { ClaimLinkStatus } from '@/gql/graphql';

export interface UseTicketClaimResult {
  claimLinkData: {
    qty: number;
    status: ClaimLinkStatus;
    issuer: {
      owner: {
        id: string;
        name: string;
        image: string | null;
      }
    }
  } | null;
  hasIssued: boolean;
  isClaimLoading: boolean;
  claimTicket: () => Promise<any>;
  viewLoading: boolean;
  viewError: any;
}

/**
 * Custom hook for claiming tickets
 * This is a backward-compatible wrapper around useTicketClaimController
 * @param ticketClaimLinkId Ticket claim link ID to manage
 */
export const useTicketClaim = (ticketClaimLinkId: string): UseTicketClaimResult => {
  return useTicketClaimController(ticketClaimLinkId);
};
