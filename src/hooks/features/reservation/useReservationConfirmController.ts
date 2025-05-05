'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useHeader } from '../../../contexts/HeaderContext';
import { useOpportunity } from '../activity/useOpportunity';
import { useLoading } from '../../core/useLoading';
import { useAuth } from '../../../contexts/AuthContext';
import { useReservationConfirmQuery } from './useReservationConfirmQuery';
import { findMatchingSlot, calculateAvailableTickets, getTicketIds } from '../../../lib/transformers/reservation';
import { parseDateTime } from '../../../utils/date';

/**
 * Controller hook for managing reservation confirmation state and logic
 */
export const useReservationConfirmController = (searchParams: {
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
  
  const {
    walletData,
    walletLoading,
    createReservation,
    creatingReservation
  } = useReservationConfirmQuery(currentUser?.id);
  
  useEffect(() => {
    updateConfig({
      title: '申し込み内容の確認',
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);
  
  useEffect(() => {
    setIsLoading(loading || walletLoading);
  }, [loading, walletLoading, setIsLoading]);
  
  const availableTickets = useMemo(() => {
    return calculateAvailableTickets(walletData, opportunity?.requiredUtilities);
  }, [opportunity?.requiredUtilities, walletData]);
  
  const selectedSlot = useMemo(() => {
    return findMatchingSlot(opportunity?.slots, slotStartsAt);
  }, [opportunity?.slots, slotStartsAt]);
  
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
        ticketIds = getTicketIds(walletData, opportunity?.requiredUtilities, ticketCount);

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
    loading: loading || walletLoading,
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
