"use client"
import { filterSlotGroupsBySelectedDate } from "@/app/reservation/data/presenter/opportunitySlot";
import { useReservationDateLoader } from "@/app/reservation/select-date/hooks/useOpportunitySlotQuery";
import { useReservationDateHandler } from "@/app/reservation/select-date/hooks/useReservationDateHandler";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import TimeSlotList from "./TimeSlotList";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

interface TimeSlotProps {
    opportunityId: string;
    onSelectDate: (date: string) => void;
}

export default function TimeSlot({ opportunityId, onSelectDate }: TimeSlotProps) {
    const [selectedDate, setSelectedDate] = useState<string | null>(null);

    const { groupedSlots, loading, error, refetch } = useReservationDateLoader({
        opportunityId: opportunityId ?? "",
      });

    const filteredDateSections = useMemo(
        () => filterSlotGroupsBySelectedDate(groupedSlots, selectedDate ? [selectedDate] : []),
        [groupedSlots, selectedDate],
      );

    if (loading) {
        return <LoadingIndicator />;
    }

    const handleDateClick = (date: string) => {
        onSelectDate(date);
    };

    return (
        <div>
            <TimeSlotList
                dateSections={filteredDateSections}
                selectedDate={selectedDate}
                onSelectDate={handleDateClick}
            />
        </div>
    )
}