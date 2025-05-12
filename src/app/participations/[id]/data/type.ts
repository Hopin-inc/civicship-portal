import { GqlOpportunityCategory } from "@/types/graphql";
import { OpportunityPlace, OpportunityHost, ActivityCard } from "@/app/activities/data/type";
import { ParticipationStatus, ParticipationStatusReason } from "@/types/participationStatus";
import { ArticleWithAuthor } from "@/app/articles/data/type";

export type ParticipationInfo = PublicParticipationInfo & Partial<PrivateParticipationInfo>;

type PublicParticipationInfo = {
  id: string;
  communityId: string;
  status: ParticipationStatus;
  reason: ParticipationStatusReason;

  opportunity: ParticipationOpportunity;

  images: string[];
  totalImageCount: number;

  date: string;
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
  interview?: ArticleWithAuthor;
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

export type ParticipationImage = {
  id: string;
  url: string;
  caption: string | null;
  participationId: string;
  createdAt: string;
  updatedAt: string;
};

export type Participation = {
  node: {
    id: string;
    status: ParticipationStatus;
    reason: ParticipationStatusReason;
    images: string[];
    user: {
      id: string;
      name: string;
      image: string | null;
    };
    reservation?: {
      id: string;
      opportunitySlot: {
        id: string;
        capacity: number;
        startsAt: string;
        endsAt: string;
        hostingStatus: string;
      };
      participations: {
        id: string;
        user: {
          id: string;
          name: string;
          image: string | null;
        };
      }[];
    };
  };
};

export type Opportunity = {
  id: string;
  title: string;
  description: string;
  type: string;
  status: string;
  communityId: string;
  hostId: string;
  startsAt: Date | string;
  endsAt: Date | string;
  createdAt: string;
  updatedAt: Date | string;
  host: {
    name: string;
    image: string | null;
    title: string;
    bio: string;
  };
  images: string[];
  location: {
    name: string;
    address: string;
    isOnline: boolean;
    lat?: number;
    lng?: number;
  };
  community?: {
    id: string;
    title: string;
    description: string;
    icon: string;
  };
  recommendedFor: string[];
  capacity: number;
  pointsForComplete?: number;
  participants: {
    id: string;
    name: string;
    image: string | null;
  }[];
  body?: string;
  createdByUser?: {
    id: string;
    name: string;
    image: string | null;
    articlesAboutMe?: any;
    opportunitiesCreatedByMe?: any;
  };
  place?: {
    name: string;
    address: string;
    latitude?: number;
    longitude?: number;
  };
  requireApproval?: boolean;
  pointsRequired?: number;
  feeRequired?: number;
  slots?: {
    edges: {
      node: {
        id: string;
        startsAt: string;
        endsAt: string;
        participations?: {
          edges: {
            node: {
              id: string;
              status: string;
              user: {
                id: string;
                name: string;
                image: string | null;
              };
            };
          }[];
        };
      };
    }[];
  };
};
