"use client";

import { useReservationConfirm } from "@/hooks";
import { useSearchParams } from "next/navigation";
import React, { useMemo } from "react";
import { ErrorState } from "@/components/shared/ErrorState";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import LoginModal from "@/components/features/login/LoginModal";
import { OpportunityInfo } from "@/components/features/reservation/OpportunityInfo";
import { ReservationDetailsCard } from "@/components/features/reservation/ReservationDetailsCard";
import { PaymentSection } from "@/components/features/reservation/PaymentSection";
import { NotesSection } from "@/components/features/reservation/NotesSection";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const params = useMemo(() => ({
    id: searchParams.get("id") ?? "",
    starts_at: searchParams.get("starts_at") ?? "",
    guests: searchParams.get("guests") ?? "",
    community_id: searchParams.get("community_id") ?? ""
  }), [searchParams]);

  const result = useReservationConfirm(params);

  return (
    <ReservationConfirmGate
      loading={result.loading}
      error={result.error}
      opportunity={result.opportunity}
      slot={result.selectedSlot}
      startDateTime={result.startDateTime}
      endDateTime={result.endDateTime}
    >
      <ConfirmUI {...result} />
    </ReservationConfirmGate>
  );
}

function ReservationConfirmGate({
    loading,
    error,
    opportunity,
    slot,
    startDateTime,
    endDateTime,
    children,
  }: {
  loading: boolean;
  error: Error | null;
  opportunity: any;
  slot: any;
  startDateTime: Date | null;
  endDateTime: Date | null;
  children: React.ReactNode;
}) {
  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorState message={error.message} />;
  if (!opportunity) return <ErrorState message="予約情報が見つかりませんでした" />;
  if (!slot?.node) return <ErrorState message="選択された時間枠が見つかりませんでした" />;
  if (!startDateTime || !endDateTime) return <ErrorState message="時間枠の日付形式が無効です" />;
  return <>{children}</>;
}

function ConfirmUI({
   opportunity,
   selectedSlot,
   startDateTime,
   endDateTime,
   participantCount,
   pricePerPerson,
   ticketCount,
   useTickets,
   setUseTickets,
   availableTickets,
   isLoginModalOpen,
   setIsLoginModalOpen,
   incrementTicket,
   decrementTicket,
   handleConfirmReservation,
   creatingReservation,
 }: ReturnType<typeof useReservationConfirm>) {
  return (
    <main className="pb-8 min-h-screen">
      <Toaster />
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />

      <OpportunityInfo
        opportunity={opportunity}
        pricePerPerson={pricePerPerson}
      />

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
          ticketCount={ticketCount}
          onIncrement={incrementTicket}
          onDecrement={decrementTicket}
          maxTickets={availableTickets}
          pricePerPerson={pricePerPerson}
          participantCount={participantCount}
          useTickets={useTickets}
          setUseTickets={setUseTickets}
        />

        <NotesSection requireApproval={opportunity?.requiredApproval} />

        <Button
          onClick={handleConfirmReservation}
          disabled={
            creatingReservation ||
            (useTickets && ticketCount > availableTickets)
          }
        >
          {creatingReservation ? "処理中..." : "申し込みを確定"}
        </Button>
      </div>
    </main>
  );
}
