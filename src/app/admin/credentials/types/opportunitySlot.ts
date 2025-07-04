import { ActivitySlotGroup } from "@/app/reservation/data/type/opportunitySlot";

export type ActivitySlotGroupWithOpportunityId = ActivitySlotGroup & {
  opportunityId: string;
};
