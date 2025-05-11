"use client";

import { ReservationParams, useReservationConfirm } from "@/hooks";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import LoginModal from "@/components/features/login/LoginModal";
import { OpportunityInfo } from "@/components/features/reservation/OpportunityInfo";
import { ReservationDetailsCard } from "@/components/features/reservation/ReservationDetailsCard";
import { PaymentSection } from "@/components/features/reservation/PaymentSection";
import { NotesSection } from "@/components/features/reservation/NotesSection";
import { ReservationContentGate } from "@/app/reservation/contentGate";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const params: ReservationParams = useMemo(
    () => ({
      id: searchParams.get("id") ?? "",
      starts_at: searchParams.get("starts_at") ?? "",
      guests: searchParams.get("guests") ?? "",
      community_id: searchParams.get("community_id") ?? "",
    }),
    [searchParams],
  );

  const result = useReservationConfirm(params);

  return (
    <ReservationContentGate
      loading={result.loading}
      error={result.error}
      nullChecks={[
        { label: "予約情報", value: result.opportunity },
        { label: "スロット情報", value: result.selectedSlot },
        { label: "開始日時", value: result.startDateTime },
        { label: "終了日時", value: result.endDateTime },
      ]}
    >
      <main className="pb-8 min-h-screen">
        <Toaster />
        <LoginModal
          isOpen={result.isLoginModalOpen}
          onClose={() => result.setIsLoginModalOpen(false)}
        />

        <OpportunityInfo opportunity={result.opportunity} />

        <div className="px-4">
          <ReservationDetailsCard
            startDateTime={result.startDateTime}
            endDateTime={result.endDateTime}
            participantCount={result.participantCount}
            location={{
              name: result.opportunity?.place?.name || "",
              address: result.opportunity?.place?.address || "",
            }}
          />

          <PaymentSection
            ticketCount={result.ticketCount}
            onIncrement={result.incrementTicket}
            onDecrement={result.decrementTicket}
            maxTickets={result.availableTickets}
            pricePerPerson={result.pricePerPerson}
            participantCount={result.participantCount}
            useTickets={result.useTickets}
            setUseTickets={result.setUseTickets}
          />

          <NotesSection requireApproval={result.opportunity?.requiredApproval} />

          <Button
            onClick={result.handleConfirmReservation}
            disabled={
              result.creatingReservation ||
              (result.useTickets && result.ticketCount > result.availableTickets)
            }
          >
            {result.creatingReservation ? "処理中..." : "申し込みを確定"}
          </Button>
        </div>
      </main>
    </ReservationContentGate>
  );
}
