"use client";

import { useMemo } from "react";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";

export interface UseAvailableDatesQueryResult {
  availableDates: Array<{
    id: string;
    startsAt: string;
    endsAt: string;
    participants: number;
    price: number;
  }>;
}

export const useAvailableDatesQuery = (
  slots: ActivitySlot[] | undefined,
): UseAvailableDatesQueryResult => {
  const availableDates = useMemo(() => {
    if (!slots) return [];

    return slots
      .map((slot) => ({
        id: slot.id,
        startsAt: slot.startsAt,
        endsAt: slot.endsAt,
        participants: slot.capacity - slot.remainingCapacity,
        price: slot.feeRequired || 0,
      }))
      .sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [slots]);

  return {
    availableDates,
  };
};
