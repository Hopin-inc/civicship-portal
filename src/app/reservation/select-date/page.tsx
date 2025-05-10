"use client";

import { ErrorState } from "@/components/shared/ErrorState";
import { DateSelectionForm } from "@/components/features/reservation/DateSelectionForm";
import { GuestSelectionForm } from "@/components/features/reservation/GuestSelectionForm";
import { TimeSlotList } from "@/components/features/reservation/TimeSlotList";
import { SelectionSheet } from "@/components/features/reservation/SelectionSheet";
import { useReservationDateSelection } from "@/hooks/features/reservation/useReservationDateSelection";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import React from "react";
import type { ActivityDetail } from "@/types/opportunity";

export default function SelectDatePage({
   searchParams,
 }: {
  searchParams: { id: string; community_id: string };
}) {
  const selection = useReservationDateSelection({
    opportunityId: searchParams.id,
    communityId: searchParams.community_id,
  });

  return (
    <ReservationContentGate
      loading={selection.loading}
      error={selection.error}
      opportunity={selection.opportunity}
    >
      <ReservationUI {...selection} />
    </ReservationContentGate>
  );
}

function ReservationContentGate({
    loading,
    error,
    opportunity,
    children,
  }: {
  loading: boolean;
  error: Error | null;
  opportunity: ActivityDetail| null;
  children: React.ReactNode;
}) {
  if (loading) return <LoadingIndicator />;
  if (error) return <ErrorState message={error.message} />;
  if (!opportunity)
    return <ErrorState message="予約情報が見つかりませんでした" />;
  return <>{children}</>;
}

function ReservationUI({
   selectedDate,
   setSelectedDate,
   selectedGuests,
   setSelectedGuests,
   activeForm,
   setActiveForm,
   dateSections,
   filteredDateSections,
   handleReservation,
   isSlotAvailable,
 }: ReturnType<typeof useReservationDateSelection>) {
  return (
    <main className="pt-16 px-4 pb-24">
      <div className="space-y-4 mb-8">
        <DateSelectionForm
          selectedDate={selectedDate}
          onOpenDateForm={() => setActiveForm("date")}
        />
        <GuestSelectionForm
          selectedGuests={selectedGuests}
          onOpenGuestForm={() => setActiveForm("guests")}
        />
      </div>

      <TimeSlotList
        dateSections={filteredDateSections}
        isSlotAvailable={isSlotAvailable}
        onSelectSlot={handleReservation}
      />

      <SelectionSheet
        isOpen={activeForm !== null}
        onClose={() => setActiveForm(null)}
        activeForm={activeForm}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        selectedGuests={selectedGuests}
        setSelectedGuests={setSelectedGuests}
        dateSections={dateSections}
      />
    </main>
  );
}
