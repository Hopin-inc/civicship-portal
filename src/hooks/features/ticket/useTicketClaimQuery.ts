'use client';

import { useQuery, useMutation } from "@apollo/client";
import { TICKET_CLAIM } from "@/graphql/reward/ticket/mutation";
import { VIEW_TICKET_CLAIM } from "@/graphql/reward/ticketClaimLink/query";

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
