"use client";

import { Button } from "@/components/ui/button";
import LoginModal from "@/app/login/components/LoginModal";
import OpportunityInfo from "@/app/reservation/confirm/components/OpportunityInfo";
import ReservationDetailsCard from "@/app/reservation/confirm/components/ReservationDetailsCard";
import PaymentSection from "@/app/reservation/confirm/components/PaymentSection";
import NotesSection from "@/app/reservation/confirm/components/NotesSection";
import { useReservationConfirm } from "@/app/reservation/confirm/hooks/useReservationConfirm";
import { useAuth } from "@/contexts/AuthContext";
import { useTicketCounter } from "@/app/reservation/confirm/hooks/useTicketCounter";
import { useReservationParams } from "@/app/reservation/confirm/hooks/useReservationParams";
import { notFound, useRouter } from "next/navigation";
import { HeaderConfig } from "@/contexts/HeaderContext";
import { useEffect, useMemo, useRef } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { toast } from "sonner";
import { useReservationUIState } from "@/app/reservation/confirm/hooks/useReservationUIState";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { ParticipationAge } from "./components/ParticipationAge";
import { errorMessages } from "@/utils/errorMessage";
import { useReservationCommand } from "@/app/reservation/confirm/hooks/useReservationAction";

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
  const { opportunityId, slotId, participantCount, communityId } = useReservationParams();

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
    const result = await handleReservation({
      opportunity,
      selectedSlot,
      wallets,
      user,
      ticketCounter,
      participantCount,
      useTickets: ui.useTickets,
      comment: ui.ageComment ?? undefined,
    });

    if (!result.success) {
      if (!user) {
        ui.setIsLoginModalOpen(true);
      } else {
        const message = errorMessages[result.code] ?? "予期しないエラーが発生しました。";
        toast.error(message);
        console.error("Reservation failed:", result.code);
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

  return (
    <>
      <main className="pb-8 min-h-screen">
        <LoginModal isOpen={ui.isLoginModalOpen} onClose={() => ui.setIsLoginModalOpen(false)} />
        <OpportunityInfo opportunity={opportunity} />

        <div className="px-6">
          <ReservationDetailsCard
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            participantCount={participantCount}
            location={{
              name: opportunity?.place?.name || "",
              address: opportunity?.place?.address || "",
            }}
          />
        </div>
        <div className="h-2 bg-border" />
        <ParticipationAge ageComment={ui.ageComment} setAgeComment={ui.setAgeComment} />
        <div className="h-2 bg-border" />
        <PaymentSection
          ticketCount={ticketCounter.count}
          onIncrement={ticketCounter.increment}
          onDecrement={ticketCounter.decrement}
          maxTickets={availableTickets}
          pricePerPerson={opportunity?.feeRequired ?? 0}
          participantCount={participantCount}
          useTickets={ui.useTickets}
          setUseTickets={ui.setUseTickets}
        />
        <div className="h-2 bg-border" />
        <NotesSection />
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t border-border max-w-mobile-l w-full h-20 flex items-center px-4 py-4 justify-between mx-auto">
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
        </footer>
      </main>
    </>
  );
}
