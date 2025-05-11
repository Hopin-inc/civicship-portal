'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useHeader } from '@/contexts/HeaderContext';
import { useLoading } from '@/hooks/core/useLoading';
import { useAuth } from '@/contexts/AuthContext';
import { COMMUNITY_ID } from '@/utils';
import { parseDateTime } from '@/utils/date';
import { presenterActivityDetail } from '@/presenters/opportunity';
import { useReservationConfirmQuery } from './useReservationConfirmQuery';
import {
  findMatchingSlot,
  calculateAvailableTickets,
  getTicketIds,
} from '@/presenters/reservation';
import type { ActivityDetail } from '@/types/opportunity';
import { useGetOpportunityQuery } from "@/types/graphql";

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
  const slotStartsAt = params.starts_at || '';
  const slotId = params.slot_id || '';
  const participantCount = parseInt(params.guests || '1', 10);

  // -------------------------------
  // 1. Opportunityデータ取得
  // -------------------------------
  const {
    opportunity,
    loading: oppLoading,
    error: oppError
  } = useOpportunityData(opportunityId);

  // -------------------------------
  // 2. チケット・スロット関連情報
  // -------------------------------
  const {
    walletData,
    walletLoading,
    selectedSlot,
    availableTickets,
    startDateTime,
    endDateTime,
    createReservation,
    creatingReservation
  } = useSlotAndTicketInfo(opportunity, slotStartsAt, user?.id, slotId);

  // -------------------------------
  // 3. チケットUI制御・予約実行
  // -------------------------------
  const {
    ticketCount,
    useTickets,
    setUseTickets,
    isLoginModalOpen,
    setIsLoginModalOpen,
    incrementTicket,
    decrementTicket,
    handleConfirmReservation,
  } = useReservationActions({
    opportunityId,
    selectedSlot,
    opportunity,
    walletData,
    participantCount,
    useTicketsInitial: false,
    router,
    createReservation,
    user,
    availableTickets,
  });

  // -------------------------------
  // 4. ヘッダー / ローディング
  // -------------------------------
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
  slotStartsAt: string,
  userId?: string,
  slotId?: string
) {
  const {
    walletData,
    walletLoading,
    createReservation,
    creatingReservation,
  } = useReservationConfirmQuery(userId);

  const selectedSlot = useMemo(() => {
    console.log("Finding slot with:", { startsAt: slotStartsAt, slotId });
    console.log("Available slots:", opportunity?.slots);
    return findMatchingSlot(opportunity?.slots, slotStartsAt, slotId);
  }, [opportunity?.slots, slotStartsAt, slotId]);

  const availableTickets = useMemo(
    () => calculateAvailableTickets(walletData, opportunity?.requiredTicket),
    [walletData, opportunity?.requiredTicket]
  );

  const startDateTime = selectedSlot?.node?.startsAt
    ? parseDateTime(String(selectedSlot.node.startsAt))
    : null;

  const endDateTime = selectedSlot?.node?.endsAt
    ? parseDateTime(String(selectedSlot.node.endsAt))
    : null;

  return {
    walletData,
    walletLoading,
    selectedSlot,
    availableTickets,
    startDateTime,
    endDateTime,
    createReservation,
    creatingReservation,
  };
}

function useReservationActions({
                                 opportunityId,
                                 selectedSlot,
                                 opportunity,
                                 walletData,
                                 participantCount,
                                 useTicketsInitial,
                                 router,
                                 createReservation,
                                 user,
                                 availableTickets,
                               }: {
  opportunityId: string;
  selectedSlot: any;
  opportunity: ActivityDetail | null;
  walletData: any;
  participantCount: number;
  useTicketsInitial: boolean;
  router: ReturnType<typeof useRouter>;
  createReservation: any;
  user: any;
  availableTickets: number;
}) {
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

    if (!opportunityId || !selectedSlot?.node) {
      toast.error("必要な情報が不足しています");
      return;
    }

    const ticketIds = useTickets
      ? getTicketIds(walletData, opportunity?.requiredTicket, ticketCount)
      : [];

    if (useTickets && ticketIds.length < ticketCount) {
      toast.error("必要なチケットが不足しています");
      return;
    }

    try {
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

      const reservation = result.data?.reservationCreate?.reservation;
      if (reservation) {
        toast.success("予約が完了しました");
        router.push(`/reservation/complete?opportunity_id=${opportunityId}&reservation_id=${reservation.id}`);
      }
    } catch (err) {
      console.error("Reservation error:", err);
      toast.error(
        err instanceof Error ? err.message : "予約に失敗しました。もう一度お試しください。"
      );
    }
  }, [
    user,
    selectedSlot?.node,
    opportunityId,
    ticketCount,
    walletData,
    opportunity?.requiredTicket,
    participantCount,
    useTickets,
    createReservation,
    router,
  ]);

  return {
    ticketCount,
    useTickets,
    setUseTickets,
    isLoginModalOpen,
    setIsLoginModalOpen,
    incrementTicket,
    decrementTicket,
    handleConfirmReservation,
  };
}
