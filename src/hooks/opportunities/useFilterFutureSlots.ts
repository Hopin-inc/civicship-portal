"use client";

import { useMemo } from "react";
import { ActivitySlot, QuestSlot } from "@/app/reservation/data/type/opportunitySlot";

export const useFilterFutureSlots = (slots: (ActivitySlot | QuestSlot)[] | undefined): (ActivitySlot | QuestSlot)[] => {
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
