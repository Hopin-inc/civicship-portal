"use client";

import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import LoginModal from "@/app/login/components/LoginModal";
import { OpportunityInfo } from "@/app/reservation/components/OpportunityInfo";
import { ReservationDetailsCard } from "@/app/reservation/components/ReservationDetailsCard";
import { PaymentSection } from "@/app/reservation/components/PaymentSection";
import { NotesSection } from "@/app/reservation/components/NotesSection";
import { ReservationContentGate } from "@/app/reservation/contentGate";
import { useReservationConfirm } from "@/app/reservation/hooks/useReservationConfirm";
import { useAuth } from "@/contexts/AuthContext";
import { useTicketCounter } from "@/app/reservation/confirm/hooks/useTicketCounter";
import { useReservationActions } from "@/app/reservation/confirm/hooks/useReservationAction";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useReservationParams } from "@/app/reservation/confirm/hooks/useReservationParams";
import { createReservationHandler } from "@/app/reservation/confirm/hooks/useReservationHandler";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import { useRouter } from "next/navigation";
import { useMemo, useCallback } from "react";

export default function ConfirmPage() {
  const { user } = useAuth();
  const { opportunityId, slotId, participantCount } = useReservationParams();

  useHeaderConfig({
    title: "申し込み内容の確認",
    showBackButton: true,
    showLogo: false,
  });

  const {
    opportunity,
    selectedSlot,
    wallets,
    startDateTime,
    endDateTime,
    availableTickets,
    loading,
    error,
  } = useReservationConfirm({ opportunityId, slotId, userId: user?.id });

  const ticketCounter = useTicketCounter(availableTickets);
  
  const memoizedIncrement = useCallback(ticketCounter.increment, [ticketCounter.increment]);
  const memoizedDecrement = useCallback(ticketCounter.decrement, [ticketCounter.decrement]);
  
  const memoizedTicketCounter = useMemo(() => ({
    count: ticketCounter.count,
    increment: memoizedIncrement,
    decrement: memoizedDecrement
  }), [ticketCounter.count, memoizedIncrement, memoizedDecrement]);

  const {
    isLoginModalOpen,
    setIsLoginModalOpen,
    useTickets,
    setUseTickets,
    handleReservation,
    creatingReservation,
  } = useReservationActions({ opportunity, selectedSlot, wallets, user, ticketCounter: memoizedTicketCounter });

  const router = useRouter();
  
  const handleCloseLoginModal = useCallback(() => {
    setIsLoginModalOpen(false);
  }, [setIsLoginModalOpen]);
  
  const handleConfirm = useCallback(() => {
    if (!opportunity || !handleReservation) return;
    return createReservationHandler(opportunity, handleReservation, router)();
  }, [opportunity, handleReservation, router]);

  return (
    <>
      <ReservationContentGate
        loading={loading}
        error={error}
        nullChecks={[
          { label: "予約情報", value: opportunity },
          { label: "スロット情報", value: selectedSlot },
        ]}
      >
        <main className="pb-8 min-h-screen">
          <Toaster />
          <LoginModal isOpen={isLoginModalOpen} onClose={handleCloseLoginModal} />

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
              onIncrement={memoizedIncrement}
              onDecrement={memoizedDecrement}
              maxTickets={availableTickets}
              pricePerPerson={opportunity?.feeRequired ?? 0}
              participantCount={participantCount}
              useTickets={useTickets}
              setUseTickets={setUseTickets}
            />

            <NotesSection requireApproval={opportunity?.requiredApproval} />

            <Button
              onClick={handleConfirm}
              disabled={
                creatingReservation || (useTickets && ticketCounter.count > availableTickets)
              }
            >
              {creatingReservation ? "処理中..." : "申し込みを確定"}
            </Button>
          </div>
        </main>
      </ReservationContentGate>
    </>
  );
}
