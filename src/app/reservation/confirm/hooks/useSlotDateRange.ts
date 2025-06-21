import { IOpportunitySlot } from "@/app/reservation/data/type/opportunitySlot";
import { useMemo } from "react";
import { parseDateTime } from "@/utils/date";

export function useSlotDateRange(slot: IOpportunitySlot | null) {
  return useMemo(() => {
    const startDateTime = slot?.startsAt ? parseDateTime(String(slot.startsAt)) : null;
    const endDateTime = slot?.endsAt ? parseDateTime(String(slot.endsAt)) : null;
    return { startDateTime, endDateTime };
  }, [slot?.startsAt, slot?.endsAt]);
}
