"use client";

import DateSelectionForm from "@/app/reservation/select-date/components/DateSelectionForm";
import GuestSelectionForm from "@/app/reservation/select-date/components/GuestSelectionForm";
import SelectionSheet from "@/app/reservation/select-date/components/SelectionSheet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { HeaderConfig } from "@/contexts/HeaderContext";
import { useReservationDateLoader } from "@/app/reservation/select-date/hooks/useOpportunitySlotQuery";
import { useReservationDateHandler } from "@/app/reservation/select-date/hooks/useReservationDateHandler";
import { filterSlotGroupsBySelectedDate } from "@/app/reservation/data/presenter/opportunitySlot";
import TimeSlotList from "@/app/reservation/select-date/components/TimeSlotList";
import LoadingIndicator from "@/components/shared/LoadingIndicator";
import ErrorState from "@/components/shared/ErrorState";
import { notFound, useSearchParams } from "next/navigation";
import EmptyState from "@/components/shared/EmptyState";

export default function SelectDatePage() {
  const headerConfig: HeaderConfig = useMemo(
    () => ({
      title: "日付をえらぶ",
      showLogo: false,
      showBackButton: true,
    }),
    [],
  );
  useHeaderConfig(headerConfig);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const searchParams = useSearchParams();
  const opportunityId = searchParams.get("id");
  const communityId = searchParams.get("community_id");

  const { opportunity, groupedSlots, loading, error, refetch } = useReservationDateLoader({
    opportunityId: opportunityId ?? "",
  });

  const refetchRef = useRef<(() => void) | null>(null);
  useEffect(() => {
    refetchRef.current = refetch;
  }, [refetch]);

  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedGuests, setSelectedGuests] = useState<number>(1);
  const [activeForm, setActiveForm] = useState<"date" | "guests" | null>(null);

  const filteredDateSections = useMemo(
    () => filterSlotGroupsBySelectedDate(groupedSlots, selectedDate ? [selectedDate] : []),
    [groupedSlots, selectedDate],
  );

  const { handleReservation, isSlotAvailable } = useReservationDateHandler({
    opportunityId: opportunityId ?? "",
    communityId: communityId ?? "",
    selectedDate,
    selectedGuests,
    setSelectedDate,
  });

  if (loading) return <LoadingIndicator />;
  if (error)
    return <ErrorState title="日付選択ページを読み込めませんでした" refetchRef={refetchRef} />;
  if (!opportunity) return notFound();
  if (groupedSlots.length === 0) {
    return <EmptyState title="予約枠" />;
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
        dateSections={groupedSlots}
      />
    </main>
  );
}
