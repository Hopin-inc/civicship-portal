'use client';

import type { GqlGetParticipationQuery } from '@/types/graphql';
import { GqlParticipation, GqlOpportunityCategory, } from '@/types/graphql';
import { ParticipationDetail } from "@/types/participation";
import { presenterOpportunityHost } from "@/presenters/opportunity";
import { presenterPlace } from "@/presenters/place";

export const presenterParticipation = (raw: GqlParticipation): ParticipationDetail => {
  if (!raw || !raw.reservation || !raw.reservation.opportunitySlot || !raw.reservation.opportunitySlot.opportunity) {
    throw new Error('参加情報に必要なデータが不足しています');
  }

  const opportunity = raw.reservation.opportunitySlot.opportunity;
  const reservation = raw.reservation;

  return {
    id: raw.id,
    status: raw.status,
    communityId: opportunity.community?.id ?? '',

    reservation: {
      id: reservation.id,
      status: reservation.status,
      opportunity: {
        id: opportunity.id,
        title: opportunity.title,
        images: opportunity.images ?? [],
        host: presenterOpportunityHost(opportunity.createdByUser),
      },
      communityId: opportunity.community?.id ?? '',
      images: opportunity.images ?? [],
      totalImageCount: opportunity.images?.length ?? 0,
      date: new Date(reservation.opportunitySlot?.startsAt ?? "").toISOString(),
      participantsCount: reservation.participations?.length ?? 0,
      place: presenterPlace(opportunity.place),
      feeRequired: opportunity.feeRequired ?? 0,
      totalFeeRequired: opportunity.feeRequired ?? 0,
      category: GqlOpportunityCategory.Activity,
      isCancelable: false, // 条件に応じて補完
      cancelDue: '',        // 条件に応じて補完
    }
  };
};

export const getStatusInfo = (
  status: ParticipationStatus,
  reason: ParticipationStatusReason,
): ReservationStatus | null => {
  switch (status) {
    case ParticipationStatus.Pending:
      return {
        status: "pending",
        statusText: "案内人による承認待ちです。",
        statusSubText: "承認されると、予約が確定します。",
        statusClass: "bg-yellow-50 border-yellow-200",
      };
    case ParticipationStatus.Participating:
      return {
        status: "confirmed",
        statusText: "予約が確定しました。",
        statusSubText: "",
        statusClass: "bg-green-50 border-green-200",
      };
    case ParticipationStatus.NotParticipating:
      const isCanceled = reason === ParticipationStatusReason.OpportunityCanceled;
      return {
        status: "cancelled",
        statusText: isCanceled ? "開催が中止されました。" : "予約がキャンセルされました。",
        statusSubText: isCanceled
          ? "案内人の都合により中止となりました。"
          : "予約のキャンセルが完了しました。",
        statusClass: "bg-red-50 border-red-200",
      };
    case ParticipationStatus.Participated:
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

export const formatImageData = (images: any[]): { url: string; alt: string }[] => {
  return images.map((img) => ({
    url: (img as any).url || img,
    alt: "参加者の写真",
  }));
};

type OpportunityData = NonNullable<NonNullable<NonNullable<GqlGetParticipationQuery['participation']>['reservation']>['opportunitySlot']['opportunity']>;

export const transformOpportunity = (opportunityData: OpportunityData | undefined): Opportunity | undefined => {
  if (!opportunityData) return undefined;

  return {
    id: opportunityData.id,
    title: opportunityData.title,
    description: opportunityData.description || "",
    type: opportunityData.category === 'EVENT' ? 'EVENT' : 'QUEST',
    status: opportunityData.publishStatus === 'PUBLIC' ? 'open' : (opportunityData.publishStatus === 'COMMUNITY_INTERNAL' ? 'in_progress' : 'closed'),
    communityId: opportunityData.community?.id || "",
    hostId: opportunityData.createdByUser?.id || "",
    startsAt: opportunityData.slots?.edges?.[0]?.node?.startsAt || new Date(),
    endsAt: opportunityData.slots?.edges?.[0]?.node?.endsAt || new Date(),
    createdAt: opportunityData.createdAt,
    updatedAt: opportunityData.updatedAt || new Date(),
    host: {
      name: opportunityData.createdByUser?.name || "",
      image: opportunityData.createdByUser?.image || null,
      title: "",
      bio: "",
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
    capacity: opportunityData.capacity || 0,
    pointsForComplete: opportunityData.pointsToEarn || undefined,
    participants: opportunityData.slots?.edges?.[0]?.node?.participations?.edges?.map((edge: any) => ({
      id: edge?.node?.user?.id || "",
      name: edge?.node?.user?.name || "",
      image: edge?.node?.user?.image || null,
    })) || [],
    body: opportunityData.body || undefined,
    createdByUser: opportunityData.createdByUser ? {
      id: opportunityData.createdByUser.id,
      name: opportunityData.createdByUser.name || "",
      image: opportunityData.createdByUser.image || null,
      articlesAboutMe: undefined,
      opportunitiesCreatedByMe: undefined
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
    slots: opportunityData.slots ? {
      edges: opportunityData.slots.edges?.map((edge: any) => ({
        node: {
          id: edge?.node?.id || "",
          startsAt: edge?.node?.startsAt || "",
          endsAt: edge?.node?.endsAt || "",
          participations: edge?.node?.participations ? {
            edges: edge.node.participations.edges?.map((pEdge: any) => ({
              node: {
                id: pEdge?.node?.id || "",
                status: pEdge?.node?.status || "",
                user: {
                  id: pEdge?.node?.user?.id || "",
                  name: pEdge?.node?.user?.name || "",
                  image: pEdge?.node?.user?.image || null,
                },
              },
            })) || [],
          } : undefined,
        },
      })) || [],
    } : undefined,
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
      reservation: participationData.reservation ? {
        id: participationData.reservation.id,
        opportunitySlot: {
          id: participationData.reservation.opportunitySlot.id,
          capacity: participationData.reservation.opportunitySlot.capacity || 0,
          startsAt: participationData.reservation.opportunitySlot.startsAt,
          endsAt: participationData.reservation.opportunitySlot.endsAt,
          hostingStatus: participationData.reservation.opportunitySlot.hostingStatus,
        },
        participations: participationData.reservation.participations?.map((participation: any) => ({
          id: participation.id,
          user: {
            id: participation.user?.id || "",
            name: participation.user?.name || "",
            image: participation.user?.image || null,
          }
        })) || [],
      } : undefined,
    },
  };
};
