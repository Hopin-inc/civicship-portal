"use client";

import { Button } from "@/components/ui/button";
import ReservationDetailsCard from "@/app/reservation/confirm/components/ReservationDetailsCard";
import PaymentSection from "@/app/reservation/confirm/components/PaymentSection";
import NotesSection from "@/app/reservation/confirm/components/NotesSection";
import { useReservationConfirm } from "@/app/reservation/confirm/hooks/useReservationConfirm";
import { useAuth } from "@/contexts/AuthProvider";
import { useTicketCounter } from "@/app/reservation/confirm/hooks/useTicketCounter";
import { useReservationParams } from "@/app/reservation/confirm/hooks/useReservationParams";
import { notFound, useRouter } from "next/navigation";
import { HeaderConfig } from "@/contexts/HeaderContext";
import { useEffect, useMemo, useRef, useState } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { toast } from "sonner";
import { useReservationUIState } from "@/app/reservation/confirm/hooks/useReservationUIState";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { ParticipationAge } from "./components/ParticipationAge";
import { errorMessages } from "@/utils/errorMessage";
import { useReservationCommand } from "@/app/reservation/confirm/hooks/useReservationAction";
import OpportunityCardHorizontal from "@/app/activities/components/Card/CardHorizontal";
import { GqlOpportunityCategory } from "@/types/graphql";
import { COMMUNITY_ID } from "@/utils";
import { LiffService } from "@/lib/auth/liff-service";

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

  const { user } = useAuth();
  const router = useRouter();
  const {
    opportunityId,
    slotId,
    participantCount: initialParticipantCount,
    communityId,
  } = useReservationParams();
  const currentPath =
    typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";

  const [participantCount, setParticipantCount] = useState<number>(initialParticipantCount);

  const {
    opportunity,
    selectedSlot,
    wallets,
    startDateTime,
    endDateTime,
    availableTickets,
    loading,
    hasError,
    triggerRefetch,
  } = useReservationConfirm({ opportunityId, slotId, userId: user?.id });

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = triggerRefetch;
  }, [triggerRefetch]);

  const ticketCounter = useTicketCounter(availableTickets);

  const ui = useReservationUIState();
  const { handleReservation, creatingReservation } = useReservationCommand();

  if (loading) return <LoadingIndicator />;
  if (hasError)
    return <ErrorState title="予約情報を読み込めませんでした" refetchRef={refetchRef} />;
  if (!opportunity) return notFound();

  const handleConfirm = async () => {
    if (!user) {
      const liffService = LiffService.getInstance();
      window.location.href = liffService.getLiffUrl(currentPath);
      return;
    }

    const result = await handleReservation({
      opportunity,
      selectedSlot,
      wallets,
      user: user ? { id: user.id } : null,
      ticketCounter,
      participantCount,
      useTickets: ui.useTickets,
      comment: ui.ageComment ?? undefined,
    });

    if (creatingReservation) {
      return <LoadingIndicator fullScreen />;
    }

    if (!result.success) {
      const message = errorMessages[result.code] ?? "予期しないエラーが発生しました。";
      toast.error(message);
      console.error("Reservation failed:", result.code);
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

  return (
    <>
      <main className="min-h-screen">
        <div className="px-6 py-4 mt-4">
          <OpportunityCardHorizontal
            opportunity={{
              id: opportunity.id,
              title: opportunity.title,
              feeRequired: opportunity.feeRequired,
              category: GqlOpportunityCategory.Activity,
              communityId: COMMUNITY_ID,
              images: opportunity.images,
              location: opportunity.place.name,
              hasReservableTicket: false,
            }}
            withShadow={false}
          />
        </div>
        <div className="px-2">
          <ReservationDetailsCard
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            participantCount={participantCount}
            location={{
              name: opportunity?.place?.name || "",
              address: opportunity?.place?.address || "",
            }}
            onChange={setParticipantCount}
          />
        </div>
        {/*<div className="h-0.5 bg-border" />*/}
        <PaymentSection
          ticketCount={ticketCounter.count}
          onIncrement={ticketCounter.increment}
          onDecrement={ticketCounter.decrement}
          maxTickets={availableTickets}
          pricePerPerson={opportunity?.feeRequired ?? null}
          participantCount={participantCount}
          useTickets={ui.useTickets}
          setUseTickets={ui.setUseTickets}
        />
        <div className="mb-2" />
        <ParticipationAge ageComment={ui.ageComment} setAgeComment={ui.setAgeComment} />
        <div className="mb-4 mt-2" />
        <NotesSection />
        <footer className="max-w-mobile-l w-full h-20 flex items-center px-4 py-6 justify-between mx-auto">
          {user ? (
            <Button
              size="lg"
              className="mx-auto px-20"
              onClick={handleConfirm}
              disabled={
                creatingReservation || (ui.useTickets && ticketCounter.count > availableTickets)
              }
            >
              {creatingReservation ? "申込処理中..." : "申し込みを確定"}
            </Button>
          ) : (
            <Button
              size="lg"
              className="mx-auto px-20 bg-[#06C755] hover:bg-[#05B74B] text-white"
              onClick={() => {
                const liffService = LiffService.getInstance();
                window.location.href = liffService.getLiffUrl(currentPath);
              }}
            >
              LINE登録して申込
            </Button>
          )}
        </footer>
      </main>
    </>
  );
}
