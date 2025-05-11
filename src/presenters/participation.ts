'use client';

import type { GqlGetParticipationQuery } from '@/types/graphql';
import { 
  GqlParticipation, 
  GqlOpportunityCategory, 
  GqlParticipationStatus, 
  GqlParticipationStatusReason 
} from '@/types/graphql';
import { 
  ParticipationDetail, 
  ActivityParticipation, 
  QuestParticipation, 
  ParticipationImage,
  Participation,
  Opportunity
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
  const isActivity = opportunity.category === GqlOpportunityCategory.Activity;

  const commonInfo = {
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
    
    images: (raw.images || []).map((url: string) => ({
      id: `img-${url.split('/').pop()}`,
      url,
      caption: null,
      participationId: raw.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })),
    totalImageCount: (raw.images || []).length,
    
    date: new Date(reservation.opportunitySlot?.startsAt ?? "").toISOString(),
    participantsCount: reservation.participations?.length ?? 0,
    place: presenterPlace(opportunity.place),
    
    isCancelable: false,
    cancelDue: '',
  };

  if (isActivity) {
    return {
      ...commonInfo,
      feeRequired: opportunity.feeRequired ?? 0,
      totalFeeRequired: (opportunity.feeRequired ?? 0) * (commonInfo.participantsCount || 1),
      category: GqlOpportunityCategory.Activity,
    };
  } else {
    return {
      ...commonInfo,
      pointsToEarn: opportunity.pointsToEarn ?? 0,
      totalPointsToEarn: (opportunity.pointsToEarn ?? 0) * (commonInfo.participantsCount || 1),
      category: GqlOpportunityCategory.Quest,
    };
  }
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

export const formatImageData = (images: ParticipationImage[]): { url: string; alt: string }[] => {
  return images.map((img) => ({
    url: img.url,
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
      images: (participationData.images || []).map((url: string) => ({
        id: `img-${url.split('/').pop()}`,
        url,
        caption: null,
        participationId: participationData.id || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })),
      user: {
        id: participationData.user?.id || "",
        name: participationData.user?.name || "",
        image: participationData.user?.image || null,
      },
      reservation: participationData.reservation && participationData.reservation.opportunitySlot ? {
        id: participationData.reservation.id,
        opportunitySlot: {
          id: participationData.reservation.opportunitySlot.id,
          capacity: participationData.reservation.opportunitySlot.capacity || 0,
          startsAt: participationData.reservation.opportunitySlot.startsAt.toString(),
          endsAt: participationData.reservation.opportunitySlot.endsAt.toString(),
          hostingStatus: participationData.reservation.opportunitySlot.hostingStatus,
        },
        participations: [{
          id: "",
          user: {
            id: "",
            name: "",
            image: null
          }
        }],
      } : undefined,
    },
  };
};
