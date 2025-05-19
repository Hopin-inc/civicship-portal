import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";
import { buildReservationParams } from "@/app/reservation/data/presenter/opportunitySlot";

export const useReservationDateHandler = ({
  opportunityId,
  communityId,
  selectedDate,
  selectedGuests,
  setSelectedDate,
}: {
  opportunityId: string;
  communityId: string;
  selectedDate: string | null;
  selectedGuests: number;
  setSelectedDate: (value: string) => void;
}) => {
  const router = useRouter();

  const handleReservation = useCallback(
    (slot: ActivitySlot) => {
      if (!selectedDate) {
        const date = new Date(slot.startsAt);
        const dateLabel = date.toLocaleDateString("ja-JP", {
          year: "numeric",
          month: "long",
          day: "numeric",
          weekday: "long",
        });
        setSelectedDate(dateLabel);
      }

      const params = buildReservationParams(opportunityId, communityId, slot, selectedGuests);
      router.push(`/reservation/confirm?${params.toString()}`);
    },
    [opportunityId, communityId, selectedGuests, selectedDate, setSelectedDate],
  );

  return {
    handleReservation,
    isSlotAvailable: (slot: ActivitySlot) =>
      slot.remainingCapacity != null && slot.remainingCapacity >= selectedGuests,
  };
};
