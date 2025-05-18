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
import { useReservationCommand } from "@/app/reservation/confirm/hooks/useReservationAction";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";

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
      useTickets: ui.useTickets,
    });

    if (!result.success) {
      if (!user) {
        ui.setIsLoginModalOpen(true);
      } else {
        switch (result.typename) {
          case "ReservationFullError":
            toast.error("予約枠が満員です。別の日時をお試しください。");
            break;
          case "ReservationAdvanceBookingRequiredError":
            toast.error("開始日から7日以上前に申し込みが必要です。");
            break;
          case "ReservationNotAcceptedError":
            toast.error("予約が承認されていません。");
            break;
          case "SlotNotScheduledError":
            toast.error("予約枠は開催を予定されていません。");
            break;
          case "TicketParticipantMismatchError":
            toast.error(`チケット数と参加者数が一致しません。`);
            break;
          case "MissingTicketIdsError":
            toast.error("チケットが指定されていません。");
            break;
          default:
            toast.error(`申し込みに失敗しました。: ${result.error}`);
        }
        console.error("Reservation failed:", result.error);
      }
      return;
    }

    toast.success("申し込みが完了しました。");

    const query = new URLSearchParams({
      id: opportunityId,
      community_id: communityId ?? "",
      reservation_id: result.reservationId,
    });
    router.push(`/reservation/complete?${query.toString()}`);
  };

  return (
    <>
      <main className="pb-8 min-h-screen">
        <LoginModal isOpen={ui.isLoginModalOpen} onClose={() => ui.setIsLoginModalOpen(false)} />
        <OpportunityInfo opportunity={opportunity} />

        <div className="px-4">
          <ReservationDetailsCard
            startDateTime={startDateTime}
            endDateTime={endDateTime}
            participantCount={participantCount}
            location={{
              name: opportunity?.place?.name || "",
              address: opportunity?.place?.address || "",
            }}
          />
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
          <NotesSection />
          <Button
            onClick={handleConfirm}
            disabled={
              creatingReservation || (ui.useTickets && ticketCounter.count > availableTickets)
            }
          >
            {creatingReservation ? "申込処理中..." : "申し込みを確定"}
          </Button>
        </div>
      </main>
    </>
  );
}
