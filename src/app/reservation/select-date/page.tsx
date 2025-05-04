"use client";

import { ErrorState } from "@/app/components/shared/ErrorState";
import { LoadingIndicator } from "@/app/components/shared/LoadingIndicator";
import { DateSelectionForm } from "@/app/components/features/reservation/DateSelectionForm";
import { GuestSelectionForm } from "@/app/components/features/reservation/GuestSelectionForm";
import { TimeSlotList } from "@/app/components/features/reservation/TimeSlotList";
import { SelectionSheet } from "@/app/components/features/reservation/SelectionSheet";
import { useReservationDateSelection } from "@/hooks/useReservationDateSelection";

/**
 * Page component for selecting reservation date and guests
 */
export default function SelectDatePage({
  searchParams,
}: {
  searchParams: { id: string; community_id: string };
}) {
  const {
    opportunity,
    loading,
    error,
    selectedDate,
    setSelectedDate,
    selectedGuests,
    setSelectedGuests,
    activeForm,
    setActiveForm,
    dateSections,
    filteredDateSections,
    handleReservation,
    isSlotAvailable
  } = useReservationDateSelection({
    opportunityId: searchParams.id,
    communityId: searchParams.community_id
  });

  if (loading) {
    return <LoadingIndicator message="読み込み中..." />;
  }

  if (error) {
    return <ErrorState message={error.message} />;
  }

  if (!opportunity) {
    return <ErrorState message="予約情報が見つかりませんでした" />;
  }

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
