"use client";

import { useMemo } from "react";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";

export const useSortedSlotsByStartsAt= (
  slots: ActivitySlot[] | undefined,
): ActivitySlot[] => {
  return useMemo(() => {
    if (!slots) return [];
    return [...slots].sort((a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime());
  }, [slots]);
};