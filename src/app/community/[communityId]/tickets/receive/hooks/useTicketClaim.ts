import { useTicketClaimController } from "@/app/community/[communityId]/tickets/receive/hooks/useTicketClaimController";
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
    utility: {
      name: string;
      description?: string;
    };
    qtyToBeIssued: number;
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
  const utility = raw?.issuer?.utility;

  const claimLinkData: TicketClaimData | null =
    raw?.issuer && owner?.id && owner?.name && utility?.name && raw.qty !== undefined && raw.status !== undefined
      ? {
          qty: raw.qty,
          status: raw.status,
          issuer: {
            owner: {
              id: owner.id,
              name: owner.name,
              image: owner.image ?? null,
            },
            utility: {
              name: utility.name,
              description: utility.description ?? undefined,
            },
            qtyToBeIssued: raw.issuer.qtyToBeIssued,
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
