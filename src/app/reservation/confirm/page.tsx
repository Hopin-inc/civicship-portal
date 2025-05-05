"use client";

import { useSearchParams } from "next/navigation";
import { ErrorState } from "@/components/shared/ErrorState";
import { LoadingIndicator } from "@/components/shared/LoadingIndicator";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import LoginModal from "@/components/features/login/LoginModal";
import { OpportunityInfo } from "@/components/features/reservation/OpportunityInfo";
import { ReservationDetailsCard } from "@/components/features/reservation/ReservationDetailsCard";
import { PaymentSection } from "@/components/features/reservation/PaymentSection";
import { NotesSection } from "@/components/features/reservation/NotesSection";
import { useReservationConfirm } from "@/hooks/features/reservation/useReservationConfirm";

/**
 * Page component for reservation confirmation
 */
export default function ConfirmPage() {
  const searchParams = useSearchParams();
  const params = {
    id: searchParams.get("id"),
    starts_at: searchParams.get("starts_at"),
    guests: searchParams.get("guests"),
    community_id: searchParams.get("community_id")
  };
  
  const {
    opportunity,
    loading,
    error,
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
    creatingReservation,
    incrementTicket,
    decrementTicket,
    handleConfirmReservation
  } = useReservationConfirm(params);

  if (loading) {
    return <LoadingIndicator message="読み込み中..." />;
  }

  if (error) {
    return <ErrorState message={error.message} />;
  }

  if (!opportunity) {
    return <ErrorState message="予約情報が見つかりませんでした" />;
  }
  
  if (!selectedSlot?.node) {
    return <ErrorState message="選択された時間枠が見つかりませんでした" />;
  }

  if (!startDateTime || !endDateTime) {
    return <ErrorState message="時間枠の日付形式が無効です" />;
  }

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
            name: opportunity.place?.name || '高松市役所',
            address: opportunity.place?.address || '香川県高松市番町1丁目8-15'
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

        <NotesSection requireApproval={opportunity.requireApproval} />

        <Button 
          className="w-full py-6 text-base rounded-lg bg-[#4361EE] hover:bg-[#3651DE]" 
          size="lg"
          onClick={handleConfirmReservation}
          disabled={creatingReservation || (useTickets && ticketCount > availableTickets)}
        >
          {creatingReservation ? "処理中..." : "申し込みを確定"}
        </Button>
      </div>
    </main>
  );
}
