import { ActivitySlotGroup } from "@/app/(authed)/reservation/data/type/opportunitySlot";

export type ActivitySlotGroupWithOpportunityId = ActivitySlotGroup & {
  opportunityId: string;
};
