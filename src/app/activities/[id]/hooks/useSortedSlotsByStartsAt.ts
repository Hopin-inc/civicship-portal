"use client";

import { useMemo } from "react";
import { ActivitySlot, QuestSlot } from "@/app/reservation/data/type/opportunitySlot";

export const useSortedSlotsByStartsAt= (
  slots: (ActivitySlot | QuestSlot)[] | undefined,
): (ActivitySlot | QuestSlot)[] => {
  return useMemo(() => {
    if (!slots) return [];
    return [...slots].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [slots]);
};