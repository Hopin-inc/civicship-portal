'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useHeader } from '@/contexts/HeaderContext';
import { useLoading } from '@/hooks/core/useLoading';
import { useAuth } from '@/contexts/AuthContext';
import { COMMUNITY_ID } from '@/utils';
import { presenterActivityDetail } from '@/presenters/opportunity';
import { useReservationConfirmQuery } from './useReservationConfirmQuery';
import type { ActivityDetail } from '@/types/opportunity';
import {
  GqlUser, GqlWallet,
  useGetOpportunityQuery,
} from "@/types/graphql";
import { useAvailableTickets } from "@/hooks/features/ticket/useAvailableTickets";
import { useSlotDateRange } from "@/hooks/features/reservation/confirm/useSlotDateRange";
import { ActivitySlot } from "@/types/opportunitySlot";
import { useCreateReservationHandler } from "@/hooks/features/reservation/confirm/useCreateReservationHandler";

export const useReservationConfirm = (params: {
  id: string | null;
  starts_at: string | null;
  guests: string | null;
  community_id: string | null;
  slot_id?: string | null;
}) => {
  const router = useRouter();
  const { updateConfig } = useHeader();
  const { setIsLoading } = useLoading();
  const { user } = useAuth();

  const opportunityId = params.id || '';
  const slotId = params.slot_id || '';
  const participantCount = parseInt(params.guests || '1', 10);

  const {
    opportunity,
    loading: oppLoading,
    error: oppError
  } = useOpportunityData(opportunityId);

  const {
    wallets,
    walletLoading,
    selectedSlot,
    availableTickets,
    startDateTime,
    endDateTime,
  } = useSlotAndTicketInfo(opportunity, user?.id, slotId);

  const {
    ticketCount,
    useTickets,
    setUseTickets,
    isLoginModalOpen,
    setIsLoginModalOpen,
    incrementTicket,
    decrementTicket,
    handleConfirmReservation,
    creatingReservation,
  } = useReservationActions({
    opportunity,
    selectedSlot,
    wallets,
    participantCount,
    useTicketsInitial: false,
    user,
    availableTickets,
  });


  useEffect(() => {
    updateConfig({
      title: '申し込み内容の確認',
      showBackButton: true,
      showLogo: false,
    });
  }, [updateConfig]);

  useEffect(() => {
    setIsLoading(oppLoading || walletLoading);
  }, [oppLoading, walletLoading, setIsLoading]);

  return {
    opportunity,
    loading: oppLoading || walletLoading,
    error: oppError,
    selectedSlot,
    startDateTime,
    endDateTime,
    participantCount,
    pricePerPerson: opportunity?.feeRequired || 0,
    ticketCount,
    useTickets,
    setUseTickets,
    availableTickets,
    isLoginModalOpen,
    setIsLoginModalOpen,
    creatingReservation,
    incrementTicket,
    decrementTicket,
    handleConfirmReservation,
  };
};

// ================================
// 🔽 内部分割関数郡
// ================================

function useOpportunityData(opportunityId: string) {
  const { data, loading, error } = useGetOpportunityQuery({
    variables: {
      id: opportunityId,
      permission: { communityId: COMMUNITY_ID },
    },
    skip: !opportunityId,
    fetchPolicy: "network-only",
    errorPolicy: "all",
    onError: (err) => console.error("Opportunity query error:", err),
  });

  const opportunity: ActivityDetail | null = useMemo(() => {
    return data?.opportunity ? presenterActivityDetail(data.opportunity) : null;
  }, [data]);

  return { opportunity, loading, error: error ?? null };
}

function useSlotAndTicketInfo(
  opportunity: ActivityDetail | null,
  userId?: string,
  slotId?: string
) {
  const reservation = useReservationConfirmQuery(userId);
  const selectedSlot = useMemo(() => {
    if (!opportunity || !slotId) return null;
    return opportunity.slots.find((slot) => slot.id === slotId) ?? null;
  }, [opportunity, slotId]);
  const availableTickets = useAvailableTickets(opportunity, userId);
  const { startDateTime, endDateTime } = useSlotDateRange(selectedSlot);

  return {
    ...reservation,
    selectedSlot,
    availableTickets,
    startDateTime,
    endDateTime,
  };
}

function useReservationActions({
                                 opportunity,
                                 selectedSlot,
                                 wallets,
                                 participantCount,
                                 useTicketsInitial,
                                 user,
                                 availableTickets,
                               }: {
  opportunity: ActivityDetail | null;
  selectedSlot: ActivitySlot | null;
  wallets: GqlWallet[] | null;
  participantCount: number;
  useTicketsInitial: boolean;
  user: Pick<GqlUser, "id"> | null;
  availableTickets: number;
}) {
  const router = useRouter();
  const { execute: createReservation, creatingReservation } = useCreateReservationHandler();

  const [ticketCount, setTicketCount] = useState(1);
  const [useTickets, setUseTickets] = useState(useTicketsInitial);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  const incrementTicket = () => {
    setTicketCount((prev) => Math.min(prev + 1, availableTickets));
  };

  const decrementTicket = () => {
    setTicketCount((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirmReservation = useCallback(async () => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!selectedSlot || !opportunity) {
      toast.error("必要な情報が不足しています");
      return;
    }

    const result = await createReservation({
      opportunity,
      selectedSlot,
      participantCount: ticketCount,
      wallets,
      useTickets,
    });

  }, [user, opportunity, selectedSlot, ticketCount, wallets, useTickets, createReservation]);

  return {
    ticketCount,
    useTickets,
    setUseTickets,
    isLoginModalOpen,
    setIsLoginModalOpen,
    incrementTicket,
    decrementTicket,
    handleConfirmReservation,
    creatingReservation,
  };
}
