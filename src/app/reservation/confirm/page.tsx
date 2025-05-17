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
import { useReservationParams } from "@/app/reservation/confirm/hooks/useReservationParams";
import { useRouter } from "next/navigation";
import { HeaderConfig } from "@/contexts/HeaderContext";
import { useMemo } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";

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
    error,
  } = useReservationConfirm({ opportunityId, slotId, userId: user?.id });

  const ticketCounter = useTicketCounter(availableTickets);

  const {
    useTickets,
    setUseTickets,
    isLoginModalOpen,
    setIsLoginModalOpen,
    handleReservation,
    creatingReservation,
  } = useReservationActions({ opportunity, selectedSlot, wallets, user, ticketCounter });

  const handleConfirm = async () => {
    const result = await handleReservation();

    if (!result.success) {
      if (result.error === "NOT_AUTHENTICATED") {
        setIsLoginModalOpen(true);
      } else {
        console.error("Reservation failed:", result.error);
      }
      return;
    }

    const query = new URLSearchParams({
      id: opportunityId,
      community_id: communityId ?? "",
      reservation_id: result.reservationId,
    });
    router.push(`/reservation/complete?${query.toString()}`);
  };

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
          <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
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
              useTickets={useTickets}
              setUseTickets={setUseTickets}
            />
            <NotesSection requireApproval={opportunity?.requiredApproval} />{" "}
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
