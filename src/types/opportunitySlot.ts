import { GqlOpportunitySlotHostingStatus } from "@/types/graphql";

export type ActivitySlotGroup = {
  dateLabel: string;
  slots: ActivitySlot[];
}

export type ActivitySlot = OpportunitySlot & {
  feeRequired: number;
};

export type QuestSlot = OpportunitySlot & {
  pointsToEarn: number;
};

type OpportunitySlot = {
  id: string;
  hostingStatus: GqlOpportunitySlotHostingStatus
  capacity: number;
  remainingCapacity: number;

  startsAt: string;
  endsAt: string;
};