"use client";

import { useState, useEffect } from "react";
import { useTicketClaimLinkQuery, useTicketClaimMutation, GqlClaimLinkStatus } from '@/types/graphql';
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export interface UseTicketClaimResult {
  claimLinkData: {
    qty: number;
    status: GqlClaimLinkStatus;
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
  claimTicket: () => Promise<void>;
  viewLoading: boolean;
  viewError: any;
}

export const useTicketClaim = (ticketClaimLinkId: string): UseTicketClaimResult => {
  const { user } = useAuth();
  const [hasIssued, setHasIssued] = useState(false);

  const {
    data: viewData,
    loading: viewLoading,
    error: viewError,
  } = useTicketClaimLinkQuery({
    variables: { id: ticketClaimLinkId },
  });

  const [claimTickets, { data: claimData, loading: claimLoading, error: claimError }] =
    useTicketClaimMutation();

  useEffect(() => {
    if (viewData?.ticketClaimLink == null) return;
    setHasIssued(viewData.ticketClaimLink.status !== GqlClaimLinkStatus.Issued);
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

  const claimTicket = async () => {
    await claimTickets({ variables: { input: { ticketClaimLinkId } } });
  };

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
