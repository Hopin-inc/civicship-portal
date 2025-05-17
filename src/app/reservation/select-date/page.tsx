"use client";

import { DateSelectionForm } from "@/app/reservation/components/DateSelectionForm";
import { GuestSelectionForm } from "@/app/reservation/components/GuestSelectionForm";
import { SelectionSheet } from "@/app/reservation/components/SelectionSheet";
import React, { useMemo, useState } from "react";
import { ReservationContentGate } from "@/app/reservation/contentGate";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { HeaderConfig } from "@/contexts/HeaderContext";
import { useReservationDateLoader } from "@/app/reservation/select-date/hooks/useOpportunitySlotQuery";
import { useReservationDateHandler } from "@/app/reservation/select-date/hooks/useReservationDateHandler";
import { filterSlotGroupsBySelectedDate } from "@/app/reservation/data/presenter/opportunitySlot";
import TimeSlotList from "@/app/reservation/components/TimeSlotList";

export default function SelectDatePage({
  searchParams,
}: {
  searchParams: { id: string; community_id: string };
}) {
  const headerConfig: HeaderConfig = useMemo(
    () => ({
      title: "日付をえらぶ",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  const { id, community_id } = searchParams;
  const { opportunity, groupedSlots, loading, error } = useReservationDateLoader({
    opportunityId: id,
  });

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedGuests, setSelectedGuests] = useState<number>(1);
  const [activeForm, setActiveForm] = useState<"date" | "guests" | null>(null);
  const filteredDateSections = useMemo(
    () => filterSlotGroupsBySelectedDate(groupedSlots, selectedDate ? [selectedDate] : []),
    [groupedSlots, selectedDate],
  );

  const { handleReservation, isSlotAvailable } = useReservationDateHandler({
    opportunityId: id,
    communityId: community_id,
    selectedDate,
    selectedGuests,
    setSelectedDate,
  });

  return (
    <ReservationContentGate
      loading={loading}
      error={error}
      nullChecks={[{ label: "予約情報", value: opportunity }]}
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
          dateSections={groupedSlots}
        />
      </main>
    </ReservationContentGate>
  );
}
