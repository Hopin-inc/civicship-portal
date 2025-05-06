'use client';

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { ClaimLinkStatus } from '@/gql/graphql';
import { toast } from "sonner";
import { useTicketClaimQuery } from "./useTicketClaimQuery";

export interface TicketClaimData {
  qty: number;
  status: ClaimLinkStatus;
  issuer: {
    owner: {
      id: string;
      name: string;
      image: string | null;
    }
  }
}

/**
 * Controller hook for managing ticket claim UI state
 * @param ticketClaimLinkId Ticket claim link ID to manage
 */
export const useTicketClaimController = (ticketClaimLinkId: string) => {
  const { user } = useAuth();
  const [hasIssued, setHasIssued] = useState(false);

  const {
    viewQuery: { data: viewData, loading: viewLoading, error: viewError },
    claimMutation: { data: claimData, loading: claimLoading, error: claimError },
    claimTicket
  } = useTicketClaimQuery(ticketClaimLinkId);

  useEffect(() => {
    if (viewData?.ticketClaimLink == null) return;
    setHasIssued(viewData.ticketClaimLink.status !== ClaimLinkStatus.Issued);
  }, [viewData]);

  useEffect(() => {
    if (claimData?.ticketClaim?.tickets?.length) {
      setHasIssued(true);
      toast.success("チケットを獲得しました！");
    }
  }, [claimData]);

  useEffect(() => {
    if (claimError) {
      toast.error("チケット発行中にエラーが発生しました: " + claimError.message);
    }
  }, [claimError]);

  const transformedClaimLinkData = viewData?.ticketClaimLink
    ? {
        qty: viewData.ticketClaimLink.qty,
        status: viewData.ticketClaimLink.status,
        issuer: {
          owner: {
            id: viewData.ticketClaimLink.issuer.owner.id,
            name: viewData.ticketClaimLink.issuer.owner.name,
            image: viewData.ticketClaimLink.issuer.owner.image || null,
          },
        },
      }
    : null;

  return {
    claimLinkData: transformedClaimLinkData,
    hasIssued,
    isClaimLoading: claimLoading,
    claimTicket,
    viewLoading,
    viewError,
  };
};
