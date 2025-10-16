"use client";
import { useMemo, useRef, useEffect, useState } from "react";
import { notFound, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthProvider";
import { HeaderConfig } from "@/contexts/HeaderContext";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { ErrorState } from "@/components/shared";
import { errorMessages } from "@/utils/errorMessage";
import { logger } from "@/lib/logging";
import { RawURIComponent } from "@/utils/path";
import { useReservationConfirm } from "@/app/reservation/confirm/hooks/useReservationConfirm";
import { useReservationParams } from "@/app/reservation/confirm/hooks/useReservationParams";
import { useReservationUIState } from "@/app/reservation/confirm/hooks/useReservationUIState";
import { useReservationCommand } from "@/app/reservation/confirm/hooks/useReservationAction";
import { useTicketCounter } from "@/app/reservation/confirm/hooks/useTicketCounter";
import { useOpportunityCalculations } from "@/app/reservation/confirm/hooks/useOpportunityCalculations";
import { useReservationValidation } from "@/app/reservation/confirm/hooks/useReservationValidation";
import { presentUserWallet } from "@/app/reservation/confirm/presenters/presentReservationConfirm";
import ConfirmPageView from "@/app/reservation/confirm/components/ConfirmPageView";
import type { GqlWallet } from "@/types/graphql";

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
    wallets,
    startDateTime,
    endDateTime,
    availableTickets,
    currentPoint,
    loading,
    hasError,
    triggerRefetch,
  } = useReservationConfirm({ opportunityId, slotId, userId: user?.id });

  const userWallet = useMemo(
    () => presentUserWallet(wallets),
    [wallets]
  );
  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = triggerRefetch;
  }, [triggerRefetch]);

  const ticketCounter = useTicketCounter(availableTickets.length);
  const ui = useReservationUIState();
  const { handleReservation, creatingReservation } = useReservationCommand();

  const calculations = useOpportunityCalculations({
    opportunity,
    availableTickets,
    participantCount,
    userWallet,
  });

  const validation = useReservationValidation({
    creatingReservation,
    useTickets: ui.useTickets,
    ticketCount: ticketCounter.count,
    maxTickets: calculations.maxTickets,
    hasInsufficientPoints: calculations.hasInsufficientPoints,
  });

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
      wallets,
      user: user ?? null,
      ticketCounter,
      participantCount,
      useTickets: ui.useTickets,
      comment: ui.ageComment ?? undefined,
      usePoints: ui.usePoints,
      selectedPointCount,
      selectedTicketCount,
      selectedTickets,
      userWallet,
    });

    if (!result.success) {
      if (!user) {
        ui.setIsLoginModalOpen(false);
      } else {
        const message = errorMessages[result.code] ?? "予期しないエラーが発生しました。";
        toast.error(message);
        logger.error("Reservation failed", {
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
      availableTickets={availableTickets}
      userWallet={userWallet}
      ticketCounter={ticketCounter}
      onConfirm={handleConfirm}
      validation={validation}
      creatingReservation={creatingReservation}
      communityId={communityId}
    />
  );
}
