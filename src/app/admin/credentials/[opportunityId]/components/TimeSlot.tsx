"use client"
import { filterSlotGroupsBySelectedDate } from "@/app/reservation/data/presenter/opportunitySlot";
import { useReservationDateLoader } from "@/app/reservation/select-date/hooks/useOpportunitySlotQuery";
import { useReservationDateHandler } from "@/app/reservation/select-date/hooks/useReservationDateHandler";
import { HeaderConfig } from "@/contexts/HeaderContext";
import useHeaderConfig from "@/hooks/useHeaderConfig";
import { useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import TimeSlotList from "./TimeSlotList";
import LoadingIndicator from "@/components/shared/LoadingIndicator";

interface TimeSlotProps {
    opportunityId: string;
}

export default function TimeSlot({ opportunityId }: TimeSlotProps) {
    const headerConfig: HeaderConfig = useMemo(
        () => ({
          title: "日付を選ぶ",
          showLogo: false,
          showBackButton: true,
        }),
        [],
      );
    useHeaderConfig(headerConfig);
    const searchParams = useSearchParams();
    const community_id = searchParams.get("community_id");
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [selectedGuests, setSelectedGuests] = useState<number>(1);

    const { groupedSlots, loading, error, refetch } = useReservationDateLoader({
        opportunityId: opportunityId ?? "",
      });

    const filteredDateSections = useMemo(
        () => filterSlotGroupsBySelectedDate(groupedSlots, selectedDate ? [selectedDate] : []),
        [groupedSlots, selectedDate],
      );

    const { isSlotAvailable } = useReservationDateHandler({
        opportunityId: opportunityId ?? "",
        communityId: community_id as string,
        selectedDate: selectedDate ?? "",
        selectedGuests: selectedGuests,
        setSelectedDate: setSelectedDate,
      });

    if (loading) {
        return <LoadingIndicator />;
    }

    return (
        <div>
            <TimeSlotList
                dateSections={filteredDateSections}
            />
        </div>
    )
}