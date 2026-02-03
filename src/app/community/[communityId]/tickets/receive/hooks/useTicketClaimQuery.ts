import { useTicketClaimLinkQuery, useTicketClaimMutation } from "@/types/graphql";

export const useTicketClaimQuery = (ticketClaimLinkId: string) => {
  const view = useTicketClaimLinkQuery({ variables: { id: ticketClaimLinkId } });
  const [claim, claimState] = useTicketClaimMutation();

  const claimTicket = async () => {
    return await claim({ variables: { input: { ticketClaimLinkId } } });
  };

  return {
    view,
    claim: claimState,
    claimTicket,
  };
};
