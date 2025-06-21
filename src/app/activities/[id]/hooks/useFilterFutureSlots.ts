"use client";

import { useMemo } from "react";
import { IOpportunitySlot } from "@/app/reservation/data/type/opportunitySlot";

export const useFilterFutureSlots = (slots: IOpportunitySlot[] | undefined): IOpportunitySlot[] => {
  return useMemo(() => {
    if (!slots) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTimestamp = today.getTime();

    return [...slots].filter((slot) => {
      const slotDate = new Date(slot.startsAt);
      slotDate.setHours(0, 0, 0, 0);
      return slotDate.getTime() >= todayTimestamp;
    });
  }, [slots]);
};
