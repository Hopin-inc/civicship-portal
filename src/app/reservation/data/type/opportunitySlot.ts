import { GqlOpportunitySlotHostingStatus } from "@/types/graphql";

export type ActivitySlotGroup = {
  dateLabel: string;
  slots: ActivitySlot[];
};

export type ActivitySlot = OpportunitySlot & {
  feeRequired: number | null;
  opportunityId: string;
};

export type QuestSlot = OpportunitySlot & {
  pointsToEarn: number | null;
};

type OpportunitySlot = {
  id: string;
  hostingStatus: GqlOpportunitySlotHostingStatus;
  capacity: number;
  remainingCapacity: number;
  isReservable: boolean;

  applicantCount: number | null;

  startsAt: string;
  endsAt: string;
};
