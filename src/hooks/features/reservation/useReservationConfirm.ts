'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useHeader } from '@/contexts/HeaderContext';
import { useOpportunity } from '@/hooks/useOpportunity';
import { useLoading } from '@/hooks/useLoading';
import { useAuth } from '@/contexts/AuthContext';
import { useMutation, useQuery } from '@apollo/client';
import { toast } from 'sonner';
import { CREATE_RESERVATION_MUTATION } from '@/graphql/mutations/reservation';
import { GetUserWalletDocument } from '@/gql/graphql';
import { parseDateTime } from '@/utils/date';

/**
 * Custom hook for managing reservation confirmation state and logic
 */
export const useReservationConfirm = (searchParams: {
  id: string | null;
  starts_at: string | null;
  guests: string | null;
  community_id: string | null;
}) => {
  const router = useRouter();
  const { updateConfig } = useHeader();
  const { setIsLoading } = useLoading();
  const { user: currentUser } = useAuth();
  
  const opportunityId = searchParams.id || '';
  const slotStartsAt = searchParams.starts_at || '';
  const participantCount = parseInt(searchParams.guests || '1', 10);
  
  const [ticketCount, setTicketCount] = useState(1);
  const [useTickets, setUseTickets] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  
  const { opportunity, loading, error } = useOpportunity(opportunityId);
  
  const { data: walletData } = useQuery(GetUserWalletDocument, {
    variables: { id: currentUser?.id || '' },
    skip: !currentUser?.id,
  });
  
  const [createReservation, { loading: creatingReservation }] = useMutation(CREATE_RESERVATION_MUTATION);
  
  useEffect(() => {
    updateConfig({
      title: '申し込み内容の確認',
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);
  
  useEffect(() => {
    setIsLoading(loading);
  }, [loading, setIsLoading]);
  
  const availableTickets = useMemo(() => {
    if (!opportunity?.requiredUtilities?.length) {
      return walletData?.user?.wallets?.edges?.[0]?.node?.tickets?.edges?.length || 0;
    }

    const requiredUtilityIds = new Set(
      opportunity.requiredUtilities.map(u => u.id)
    );

    const availableTickets = walletData?.user?.wallets?.edges?.[0]?.node?.tickets?.edges?.filter(
      edge => {
        const utilityId = edge?.node?.utility?.id;
        return utilityId ? requiredUtilityIds.has(utilityId) : false;
      }
    ) || [];

    return availableTickets.length;
  }, [opportunity?.requiredUtilities, walletData]);
  
  const selectedSlot = opportunity?.slots?.edges?.find(
    edge => {
      if (!edge?.node?.startsAt || !slotStartsAt) return false;
      
      const slotDateTime = parseDateTime(String(edge.node.startsAt));
      const paramDateTime = parseDateTime(decodeURIComponent(slotStartsAt));
      
      if (!slotDateTime || !paramDateTime) return false;
      
      return slotDateTime.getTime() === paramDateTime.getTime();
    }
  );
  
  const startDateTime = selectedSlot?.node?.startsAt ? parseDateTime(String(selectedSlot.node.startsAt)) : null;
  const endDateTime = selectedSlot?.node?.endsAt ? parseDateTime(String(selectedSlot.node.endsAt)) : null;
  
  const pricePerPerson = opportunity?.feeRequired || 0;
  
  const incrementTicket = () => {
    if (ticketCount < availableTickets) {
      setTicketCount((prev) => prev + 1);
    }
  };

  const decrementTicket = () => {
    if (ticketCount > 1) {
      setTicketCount((prev) => prev - 1);
    }
  };
  
  const handleConfirmReservation = async () => {
    if (!currentUser) {
      setIsLoginModalOpen(true);
      return;
    }

    try {
      if (!opportunityId || !slotStartsAt || !selectedSlot?.node) {
        throw new Error("必要な情報が不足しています");
      }

      let ticketIds: string[] = [];
      if (useTickets) {
        ticketIds = walletData?.user?.wallets?.edges?.[0]?.node?.tickets?.edges
          ?.filter(edge => {
            if (!opportunity?.requiredUtilities?.length) return true;
            const utilityId = edge?.node?.utility?.id;
            return utilityId && opportunity.requiredUtilities.some(u => u.id === utilityId);
          })
          ?.slice(0, ticketCount)
          ?.map(edge => edge?.node?.id)
          ?.filter((id): id is string => id !== undefined) || [];

        if (ticketIds.length < ticketCount) {
          throw new Error("必要なチケットが不足しています");
        }
      }

      const result = await createReservation({
        variables: {
          input: {
            opportunitySlotId: selectedSlot.node.id,
            totalParticipantCount: participantCount,
            paymentMethod: useTickets ? "TICKET" : "FEE",
            ticketIdsIfNeed: useTickets ? ticketIds : undefined,
          },
        },
      });

      if (result.data?.reservationCreate?.reservation) {
        toast.success("予約が完了しました");
        window.location.href = `/reservation/complete?opportunity_id=${opportunityId}`;
      }
    } catch (error) {
      console.error("Reservation error:", error);
      toast.error(error instanceof Error ? error.message : "予約に失敗しました。もう一度お試しください。");
    }
  };
  
  return {
    opportunity,
    loading,
    error,
    selectedSlot,
    startDateTime,
    endDateTime,
    participantCount,
    pricePerPerson,
    ticketCount,
    useTickets,
    setUseTickets,
    availableTickets,
    isLoginModalOpen,
    setIsLoginModalOpen,
    creatingReservation,
    incrementTicket,
    decrementTicket,
    handleConfirmReservation
  };
};

export default useReservationConfirm;
