'use client';

import type { GqlGetParticipationQuery } from '@/types/graphql';
import { 
  GqlParticipation, 
  GqlOpportunityCategory, 
  GqlParticipationStatus, 
  GqlParticipationStatusReason,
  Maybe
} from '@/types/graphql';
import { 
  ParticipationDetail, 
  ActivityParticipation, 
  QuestParticipation, 
  ParticipationImage,
  Participation,
  Opportunity,
  ActivityField,
  QuestField
} from "@/types/participation";
import { ReservationStatus } from "@/types/participationStatus";
import { presenterOpportunityHost } from "@/presenters/opportunity";
import { presenterPlace } from "@/presenters/place";

export const presenterParticipation = (raw: GqlParticipation): ParticipationDetail => {
  if (!raw || !raw.reservation || !raw.reservation.opportunitySlot || !raw.reservation.opportunitySlot.opportunity) {
    throw new Error('参加情報に必要なデータが不足しています');
  }

  const opportunity = raw.reservation.opportunitySlot.opportunity;
  const reservation = raw.reservation;
  
  const category = opportunity.category;
  if (!category) throw new Error("Opportunity must have a category");

  const participantsCount = reservation.participations?.length ?? 0;
  const base = {
    id: raw.id,
    status: raw.status,
    reason: raw.reason,
    communityId: opportunity.community?.id ?? '',
    
    opportunity: {
      id: opportunity.id,
      title: opportunity.title,
      images: opportunity.images ?? [],
      host: presenterOpportunityHost(opportunity.createdByUser),
    },
    
    images: raw.images ?? [],
    totalImageCount: (raw.images ?? []).length,
    
    date: new Date(reservation.opportunitySlot?.startsAt ?? "").toISOString(),
    participantsCount,
    place: presenterPlace(opportunity.place),
    
    isCancelable: getIsCancelable(reservation.opportunitySlot?.startsAt),
    cancelDue: getCancelDue(reservation.opportunitySlot?.startsAt),
  };

  switch (category) {
    case GqlOpportunityCategory.Activity:
      return {
        ...base,
        category,
        ...presenterActivityFields(participantsCount, opportunity.feeRequired),
      };

    case GqlOpportunityCategory.Quest:
      return {
        ...base,
        category,
        ...presenterQuestFields(participantsCount, opportunity.pointsToEarn),
      };

    default:
      throw new Error(`Unsupported category: ${category}`);
  }
};

const getIsCancelable = (startsAt?: Date | string | null): boolean => {
  if (!startsAt) return false;

  const startDate = typeof startsAt === 'string' ? new Date(startsAt) : startsAt;
  const now = new Date();
  const diff = startDate.getTime() - now.getTime();
  return diff >= 24 * 60 * 60 * 1000; // 24時間以上あるか
};

const getCancelDue = (startsAt?: Date | string | null): string | undefined => {
  if (!startsAt) return undefined;

  const startDate = typeof startsAt === 'string' ? new Date(startsAt) : startsAt;
  const cancelDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
  return cancelDate.toISOString();
};

const presenterActivityFields = (
  participantsCount: number,
  feeRequired?: Maybe<number> | undefined,
): ActivityField => {
  if (feeRequired == null) {
    throw new Error("Missing ActivityField values");
  }

  return {
    feeRequired,
    totalFeeRequired: feeRequired * participantsCount,
  };
};

const presenterQuestFields = (
  participantsCount: number,
  pointsToEarn?: Maybe<number> | undefined,
): QuestField => {
  if (pointsToEarn == null) {
    throw new Error("Missing QuestField values");
  }

  return {
    pointsToEarn,
    totalPointsToEarn: pointsToEarn * participantsCount,
  };
};

export const getStatusInfo = (
  status: GqlParticipationStatus,
  reason: GqlParticipationStatusReason,
): ReservationStatus | null => {
  switch (status) {
    case "PENDING":
      return {
        status: "pending",
        statusText: "案内人による承認待ちです。",
        statusSubText: "承認されると、予約が確定します。",
        statusClass: "bg-yellow-50 border-yellow-200",
      };
    case "PARTICIPATING":
      return {
        status: "confirmed",
        statusText: "予約が確定しました。",
        statusSubText: "",
        statusClass: "bg-green-50 border-green-200",
      };
    case "NOT_PARTICIPATING":
      const isCanceled = reason === "OPPORTUNITY_CANCELED";
      return {
        status: "cancelled",
        statusText: isCanceled ? "開催が中止されました。" : "予約がキャンセルされました。",
        statusSubText: isCanceled
          ? "案内人の都合により中止となりました。"
          : "予約のキャンセルが完了しました。",
        statusClass: "bg-red-50 border-red-200",
      };
    case "PARTICIPATED":
      return null;
    default:
      return {
        status: "pending",
        statusText: "案内人による承認待ちです。",
        statusSubText: "承認されると、予約が確定します。",
        statusClass: "bg-yellow-50 border-yellow-200",
      };
  }
};

export const calculateCancellationDeadline = (startTime: Date): Date => {
  return new Date(startTime.getTime() - 24 * 60 * 60 * 1000);
};

export const formatImageData = (images: string[]): { url: string; alt: string }[] => {
  return images.map((url) => ({
    url,
    alt: "参加者の写真",
  }));
};

type OpportunityData = NonNullable<NonNullable<NonNullable<GqlGetParticipationQuery['participation']>['reservation']>['opportunitySlot']>['opportunity'];

export const transformOpportunity = (opportunityData: OpportunityData | undefined): Opportunity | undefined => {
  if (!opportunityData) return undefined;

  return {
    id: opportunityData.id,
    title: opportunityData.title,
    description: opportunityData.description || "",
    type: opportunityData.category,
    status: opportunityData.publishStatus === 'PUBLIC' ? 'open' : (opportunityData.publishStatus === 'COMMUNITY_INTERNAL' ? 'in_progress' : 'closed'),
    communityId: opportunityData.community?.id || "",
    hostId: opportunityData.createdByUser?.id || "",
    startsAt: new Date(),
    endsAt: new Date(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    host: {
      name: opportunityData.createdByUser?.name || "",
      image: opportunityData.createdByUser?.image || null,
      title: "",
      bio: opportunityData.createdByUser?.bio || "",
    },
    images: opportunityData.images || [],
    location: {
      name: opportunityData.place?.name || "",
      address: opportunityData.place?.address || "",
      isOnline: false,
      lat: opportunityData.place?.latitude || undefined,
      lng: opportunityData.place?.longitude || undefined,
    },
    community: opportunityData.community ? {
      id: opportunityData.community.id,
      title: opportunityData.community.name || "",
      description: "",
      icon: opportunityData.community.image || "",
    } : undefined,
    recommendedFor: [],
    capacity: 0,
    pointsForComplete: opportunityData.pointsToEarn || undefined,
    participants: [],
    body: opportunityData.body || undefined,
    createdByUser: opportunityData.createdByUser ? {
      id: opportunityData.createdByUser.id,
      name: opportunityData.createdByUser.name || "",
      image: opportunityData.createdByUser.image || null,
      articlesAboutMe: [],
      opportunitiesCreatedByMe: [],
    } : undefined,
    place: opportunityData.place ? {
      name: opportunityData.place.name || "",
      address: opportunityData.place.address || "",
      latitude: opportunityData.place.latitude || undefined,
      longitude: opportunityData.place.longitude || undefined,
    } : undefined,
    requireApproval: opportunityData.requireApproval || undefined,
    pointsRequired: opportunityData.pointsToEarn || undefined,
    feeRequired: opportunityData.feeRequired || undefined,
    slots: {
      edges: [],
    },
  };
};

export const transformParticipation = (participationData: GqlGetParticipationQuery['participation'] | undefined): Participation | undefined => {
  if (!participationData) return undefined;

  return {
    node: {
      id: participationData.id,
      status: participationData.status,
      reason: participationData.reason,
      images: participationData.images ?? [],
      user: {
        id: participationData.user?.id ?? "",
        name: participationData.user?.name ?? "",
        image: participationData.user?.image ?? null,
      },
      reservation: participationData.reservation && participationData.reservation.opportunitySlot ? {
        id: participationData.reservation.id,
        opportunitySlot: {
          id: participationData.reservation.opportunitySlot.id,
          capacity: participationData.reservation.opportunitySlot.capacity ?? 0,
          startsAt: participationData.reservation.opportunitySlot.startsAt?.toString() ?? "",
          endsAt: participationData.reservation.opportunitySlot.endsAt?.toString() ?? "",
          hostingStatus: participationData.reservation.opportunitySlot.hostingStatus ?? "",
        },
        participations: [],
      } : undefined,
    },
  };
};
