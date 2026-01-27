import { ActivitySlotGroup } from "@/app/[communityId]/reservation/data/type/opportunitySlot";

export type ActivitySlotGroupWithOpportunityId = ActivitySlotGroup & {
  opportunityId: string;
};
