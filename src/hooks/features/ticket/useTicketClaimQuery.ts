'use client';

import { useQuery, useMutation } from "@apollo/client";
import { VIEW_TICKET_CLAIM } from "@/graphql/queries/ticket";
import { TICKET_CLAIM } from "@/graphql/mutations/ticket";
import { ClaimLinkStatus } from '@/gql/graphql';

/**
 * Hook for fetching ticket claim data from GraphQL
 * Responsible only for data fetching, not UI control or transformation
 * @param ticketClaimLinkId Ticket claim link ID to fetch
 */
export const useTicketClaimQuery = (ticketClaimLinkId: string) => {
  const viewQuery = useQuery(VIEW_TICKET_CLAIM, {
    variables: { id: ticketClaimLinkId },
  });

  const [claimTickets, claimMutation] = useMutation(TICKET_CLAIM);

  const claimTicket = async () => {
    return await claimTickets({ variables: { input: { ticketClaimLinkId } } });
  };

  return {
    viewQuery,
    claimMutation,
    claimTicket
  };
};
