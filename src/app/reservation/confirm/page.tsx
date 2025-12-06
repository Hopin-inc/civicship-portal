"use client";
import { useMemo, useRef, useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { useAuth } from "@/contexts/AuthProvider";
import { HeaderConfig } from "@/contexts/HeaderContext";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { errorMessages } from "@/utils/errorMessage";
import { logger } from "@/lib/logging";
import { RawURIComponent } from "@/utils/path";
import { useReservationOpportunity } from "@/app/reservation/confirm/hooks/useReservationOpportunity";
import { useReservationWallet } from "@/app/reservation/confirm/hooks/useReservationWallet";
import { useReservationParams } from "@/app/reservation/confirm/hooks/useReservationParams";
import { useReservationUIState } from "@/app/reservation/confirm/hooks/useReservationUIState";
import { useReservationCommand } from "@/app/reservation/confirm/hooks/useReservationAction";
import { useTicketCounter } from "@/app/reservation/confirm/hooks/useTicketCounter";
import { calculateReservationDetails } from "@/app/reservation/confirm/utils/reservationCalculations";
import { validateReservation } from "@/app/reservation/confirm/utils/reservationValidation";
import ConfirmPageView from "@/app/reservation/confirm/components/ConfirmPageView";

export default function ConfirmPage() {
  const headerConfig: HeaderConfig = useMemo(
    () => ({
      title: "申込内容の確認",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const { opportunityId, slotId, participantCount: initialParticipantCount, communityId } = useReservationParams();

  const [participantCount, setParticipantCount] = useState<number>(initialParticipantCount);
  const [selectedPointCount, setSelectedPointCount] = useState(0);
  const [selectedTicketCount, setSelectedTicketCount] = useState(0);
  const [selectedTickets, setSelectedTickets] = useState<{ [ticketId: string]: number }>({});

  const {
    opportunity,
    selectedSlot,
    startDateTime,
    endDateTime,
    loading: oppLoading,
    error: oppError,
    refetch: oppRefetch,
  } = useReservationOpportunity({ opportunityId, slotId });

  const {
    wallet,
    loading: walletLoading,
    error: walletError,
    refetch: walletRefetch,
  } = useReservationWallet({ userId: user?.id, opportunity });

  const loading = oppLoading || walletLoading;
  const hasError = Boolean(oppError || walletError);
  const triggerRefetch = () => {
    oppRefetch();
    walletRefetch();
  };

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = triggerRefetch;
  }, [triggerRefetch]);

  const ticketCounter = useTicketCounter(wallet?.tickets.length ?? 0);
  const ui = useReservationUIState();
  const { handleReservation, creatingReservation } = useReservationCommand();

  const calculations = useMemo(
    () => calculateReservationDetails(opportunity, wallet, participantCount),
    [opportunity, wallet, participantCount]
  );

  const validation = useMemo(
    () => validateReservation(
      creatingReservation,
      ui.useTickets,
      ticketCounter.count,
      calculations.maxTickets,
      calculations.hasInsufficientPoints,
    ),
    [creatingReservation, ui.useTickets, ticketCounter.count, calculations.maxTickets, calculations.hasInsufficientPoints]
  );

  useEffect(() => {
    if (calculations.isPointsOnly) {
      ui.lockPointsToggle();
    }
  }, [calculations.isPointsOnly, ui]);

  if (loading) return <LoadingIndicator />;
  if (hasError) return <ErrorState title="予約情報を読み込めませんでした" refetchRef={refetchRef} />;
  if (!opportunity) return notFound();

  const handleConfirm = async () => {
    const result = await handleReservation({
      opportunity,
      selectedSlot,
      wallet,
      user: user ?? null,
      ticketCounter,
      participantCount,
      useTickets: ui.useTickets,
      comment: ui.ageComment ?? undefined,
      usePoints: ui.usePoints,
      selectedPointCount,
      selectedTicketCount,
      selectedTickets,
      userWallet: wallet?.currentPoint ?? null,
    });

    if (!result.success) {
      if (!user) {
        ui.setIsLoginModalOpen(true);
      } else {
        const message = errorMessages[result.code] ?? "予期しないエラーが発生しました。";
        toast.error(message);
        logger.warn("Reservation failed", {
          code: result.code,
          component: "ReservationConfirmPage",
        });
      }
      return;
    }

    toast.success("申し込みが完了しました。");
    const participationCount = result.reservation.participations?.length ?? 1;
    const query = new URLSearchParams({
      id: opportunityId,
      community_id: communityId ?? "",
      reservation_id: result.reservation.id,
      guests: participationCount.toString(),
    });
    router.push(`/reservation/complete?${query.toString()}`);
  };

  if (creatingReservation) {
    return <LoadingIndicator fullScreen />;
  }

  return (
    <ConfirmPageView
      user={user}
      isAuthenticated={isAuthenticated}
      isLoginModalOpen={ui.isLoginModalOpen}
      onLoginModalClose={() => ui.setIsLoginModalOpen(false)}
      nextPath={(window.location.pathname + window.location.search) as RawURIComponent}
      opportunity={opportunity}
      startDateTime={startDateTime}
      endDateTime={endDateTime}
      calculations={calculations}
      participantCount={participantCount}
      onParticipantCountChange={setParticipantCount}
      selectedPointCount={selectedPointCount}
      onPointCountChange={setSelectedPointCount}
      selectedTicketCount={selectedTicketCount}
      onTicketCountChange={setSelectedTicketCount}
      selectedTickets={selectedTickets}
      onSelectedTicketsChange={setSelectedTickets}
      useTickets={ui.useTickets}
      setUseTickets={ui.setUseTickets}
      usePoints={ui.usePoints}
      setUsePoints={ui.setUsePoints}
      ageComment={ui.ageComment}
      onAgeCommentChange={ui.setAgeComment}
      availableTickets={wallet?.tickets ?? []}
      userWallet={wallet?.currentPoint ?? null}
      ticketCounter={ticketCounter}
      onConfirm={handleConfirm}
      validation={validation}
      creatingReservation={creatingReservation}
      communityId={communityId}
    />
  );
}
