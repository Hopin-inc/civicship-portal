"use client";

import { DateSelectionForm } from "@/components/features/reservation/DateSelectionForm";
import { GuestSelectionForm } from "@/components/features/reservation/GuestSelectionForm";
import { TimeSlotList } from "@/components/features/reservation/TimeSlotList";
import { SelectionSheet } from "@/components/features/reservation/SelectionSheet";
import { useReservationDateSelection } from "@/hooks/features/reservation/useReservationDateSelection";
import React from "react";
import { ReservationContentGate } from "@/app/reservation/contentGate";

export default function SelectDatePage({
   searchParams,
 }: {
  searchParams: { id: string; community_id: string };
}) {
  const selection = useReservationDateSelection({
    opportunityId: searchParams.id,
    communityId: searchParams.community_id,
  });

  const {
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
  } = selection;

  return (
    <ReservationContentGate
      loading={selection.loading}
      error={selection.error}
      nullChecks={[{ label: "予約情報", value: selection.opportunity }]}
    >
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
    </ReservationContentGate>
  );
}