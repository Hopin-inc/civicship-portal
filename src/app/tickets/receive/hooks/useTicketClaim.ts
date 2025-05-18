import { useTicketClaimController } from "@/app/tickets/receive/hooks/useTicketClaimController";
import { GqlClaimLinkStatus } from "@/types/graphql";

export interface TicketClaimData {
  qty: number;
  status: GqlClaimLinkStatus;
  issuer: {
    owner: {
      id: string;
      name: string;
      image: string | null;
    };
  };
}
export interface UseTicketClaimResult {
  claimLinkData: TicketClaimData | null;
  hasIssued: boolean;
  isClaimLoading: boolean;
  claimTicket: () => Promise<any>;
  viewLoading: boolean;
  viewError: any;
}

export const useTicketClaim = (ticketClaimLinkId: string): UseTicketClaimResult => {
  const { viewData, hasIssued, viewLoading, viewError, claimLoading, claimTicket } =
    useTicketClaimController(ticketClaimLinkId);

  const raw = viewData?.ticketClaimLink;
  const owner = raw?.issuer?.owner;

  const claimLinkData: TicketClaimData | null =
    raw && owner?.id && owner?.name && raw.qty !== undefined && raw.status !== undefined
      ? {
          qty: raw.qty,
          status: raw.status,
          issuer: {
            owner: {
              id: owner.id,
              name: owner.name,
              image: owner.image ?? null,
            },
          },
        }
      : null;

  return {
    claimLinkData,
    hasIssued,
    isClaimLoading: claimLoading,
    claimTicket,
    viewLoading,
    viewError,
  };
};
