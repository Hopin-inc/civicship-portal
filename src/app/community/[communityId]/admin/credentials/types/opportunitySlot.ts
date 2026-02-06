import { ActivitySlotGroup } from "@/app/community/[communityId]/reservation/data/type/opportunitySlot";

export type ActivitySlotGroupWithOpportunityId = ActivitySlotGroup & {
  opportunityId: string;
};
