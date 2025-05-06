'use client';

import type { Opportunity, Participation, Article } from '@/types';
import type { GqlGetParticipationQuery } from '@/types/graphql';

/**
 * Type for opportunity data from GraphQL
 */
type OpportunityData = NonNullable<NonNullable<NonNullable<GqlGetParticipationQuery['participation']>['reservation']>['opportunitySlot']['opportunity']>;

/**
 * Transform opportunity data from GraphQL to application format
 */
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

/**
 * Transform participation data from GraphQL to application format
 */
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
