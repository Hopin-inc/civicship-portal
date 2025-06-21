"use client";

import { useMemo } from "react";
import { IOpportunitySlot } from "@/app/reservation/data/type/opportunitySlot";

export const useSortedSlotsByStartsAt = (
  slots: IOpportunitySlot[] | undefined,
): IOpportunitySlot[] => {
  return useMemo(() => {
    if (!slots) return [];
    return [...slots].sort(
      (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
    );
  }, [slots]);
};
