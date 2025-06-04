import { GqlOpportunitySlotHostingStatus } from "@/types/graphql";

export type ActivitySlotGroup = {
  dateLabel: string;
  slots: ActivitySlot[];
};

export type ActivitySlot = IOpportunitySlot & {
  feeRequired: number | null;
};

export type QuestSlot = IOpportunitySlot & {
  pointsToEarn: number | null;
};

type IOpportunitySlot = {
  id: string;
  hostingStatus: GqlOpportunitySlotHostingStatus;
  capacity: number;
  remainingCapacity: number;

  isReservable: boolean;

  applicantCount: number | null;

  startsAt: string;
  endsAt: string;
};
