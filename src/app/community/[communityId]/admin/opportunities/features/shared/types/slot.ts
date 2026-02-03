import { GqlOpportunitySlotHostingStatus } from "@/types/graphql";

export type SlotData = {
  id?: string;
  startAt: string;
  endAt: string;
  hostingStatus?: GqlOpportunitySlotHostingStatus;
};
