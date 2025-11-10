import {
  GqlOpportunityCategory,
  GqlOpportunitySlotHostingStatus,
  GqlReservationStatus,
} from "@/types/graphql";
import {
  ActivityCard,
  OpportunityHost,
  OpportunityPlace,
} from "@/components/domains/opportunities/types";
import { ParticipationStatus, ParticipationStatusReason } from "@/types/participationStatus";
import { TArticleWithAuthor } from "@/app/articles/data/type";

export type ParticipationInfo = PublicParticipationInfo & Partial<PrivateParticipationInfo>;

type PublicParticipationInfo = {
  id: string;
  communityId: string;
  status: ParticipationStatus;
  reason: ParticipationStatusReason;

  opportunity: ParticipationOpportunity;
  slot: ParticipationSlot;
  reservation: ParticipationReservation | null;

  images: string[];
  totalImageCount: number;

  participantsCount: number;
  place: OpportunityPlace;
};

type PrivateParticipationInfo = {
  emergencyContactPhone?: string;
};

export type ActivityField = {
  feeRequired: number;
  totalFeeRequired: number;
};

export type QuestField = {
  pointsToEarn: number;
  totalPointsToEarn: number;
};

export type ParticipationOptionalInfo = {
  interview?: TArticleWithAuthor;
  relatedOpportunity?: ActivityCard[];
  isCancelable?: boolean;
  cancelDue?: string;
};

export type ActivityParticipation = ParticipationInfo &
  ActivityField &
  ParticipationOptionalInfo & {
    category: typeof GqlOpportunityCategory.Activity;
  };

export type QuestParticipation = ParticipationInfo &
  QuestField &
  ParticipationOptionalInfo & {
    category: typeof GqlOpportunityCategory.Quest;
  };

export type ParticipationDetail = ActivityParticipation | QuestParticipation;

export type ParticipationOpportunity = {
  id: string;
  title: string;
  images: string[];
  host: OpportunityHost;
};

export type ParticipationSlot = {
  id: string;
  status: GqlOpportunitySlotHostingStatus;
  startsAt: Date;
  endsAt: Date;
};

export type ParticipationReservation = {
  id: string;
  status: GqlReservationStatus;
};
