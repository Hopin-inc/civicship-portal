'use client';

import type { GqlOpportunity, GqlParticipation } from "@/types/graphql";
import type { Opportunity, Article, Participation } from "@/types";
import { OpportunityCardProps } from '@/components/features/opportunity/OpportunityCard';

/**
 * Maps an opportunity to card props for display in UI
 */
export const mapOpportunityToCardProps = (node: Opportunity): OpportunityCardProps => ({
  id: node.id,
  title: node.title,
  price: node.feeRequired || null,
  location: node.place?.name || '場所未定',
  imageUrl: node.images?.[0] || null,
  community: {
    id: node.community?.id || '',
  },
  isReservableWithTicket: node.isReservableWithTicket || false,
});

/**
 * Transforms an article node from GraphQL to a UI-friendly format
 */
export const transformArticle = (node: any): Partial<Article> => ({
  id: node?.id || "",
  title: node?.title || "",
  description: node?.introduction || "",
  introduction: node?.introduction || "",
  thumbnail: node?.thumbnail || null,
});

/**
 * Transforms an opportunity node from GraphQL to a UI-friendly format
 * Used for nested opportunities within a parent opportunity
 */
export const transformOpportunityNode = (node: any, parent: GqlOpportunity): Opportunity => ({
  id: node?.id || "",
  title: node?.title || "",
  description: node?.description || "",
  type: "EVENT",
  status: "open",
  communityId: parent?.community?.id || "",
  hostId: parent?.createdByUser?.id || "",
  startsAt: node?.slots?.edges?.[0]?.node?.startsAt || node?.createdAt || "",
  endsAt: node?.slots?.edges?.[0]?.node?.endsAt || node?.createdAt || "",
  createdAt: node?.createdAt || "",
  updatedAt: node?.updatedAt || "",
  host: {
    name: parent?.createdByUser?.name || "",
    image: parent?.createdByUser?.image || null,
    title: "",
    bio: "",
  },
  images: node?.images || [],
  location: {
    name: "",
    address: "",
    isOnline: false,
  },
  community: parent?.community ? {
    id: parent.community.id,
    title: parent.community.name || "",
    description: "",
    icon: parent.community.image || "",
  } : undefined,
  recommendedFor: [],
  capacity: node?.capacity || 0,
  pointsForComplete: node?.pointsToEarn,
  participants: [],
  body: node?.description,
  requireApproval: node?.requireApproval,
  pointsRequired: node?.pointsToEarn,
  feeRequired: node?.feeRequired,
  slots: node?.slots || { edges: [] },
});

function transformParticipationNode(p: GqlParticipation): {
  id: string;
  status: string;
  user: {
    id: string;
    name: string;
    image: string | null;
  };
} {
  return {
    id: p.id,
    status: p.status,
    user: {
      id: p.user?.id || "",
      name: p.user?.name || "",
      image: p.user?.image || "",
    },
  };
}

function presenterOpportunitySlot(slots: GqlOpportunity["slots"]) {
  return {
    slots: slots?.map((slot) => ({
      id: slot?.id ?? "",
      startsAt: slot?.startsAt ?? "",
      endsAt: slot?.endsAt ?? "",
      participations:
        slot?.reservations?.flatMap((reservation) =>
          reservation?.participations?.map(transformParticipationNode) ?? []
        ) ?? [],
    })) ?? [],
  };
}


/**
 * Transforms a complete opportunity from GraphQL to a UI-friendly format
 */
export const transformOpportunity = (data: GqlOpportunity | null): Opportunity | null => {
  if (!data) return null;

  try {
    return {
      id: data.id,
      title: data.title,
      description: data.description || "",
      type: "EVENT",
      status: "open",
      communityId: data.community?.id || "",
      hostId: data.createdByUser?.id || "",
      startsAt: data.slots?.[0].startsAt || "",
      endsAt: data.slots?.[0]?.endsAt || "",
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      host: {
        name: data.createdByUser?.name || "",
        image: data.createdByUser?.image || null,
        title: "",
        bio: "",
      },
      images: data.images || [],
      location: {
        name: data.place?.name || "",
        address: data.place?.address || "",
        isOnline: false,
        lat: data.place?.latitude || undefined,
        lng: data.place?.longitude || undefined,
      },
      community: data.community ? {
        id: data.community.id,
        title: data.community.name || "",
        description: "",
        icon: data.community.image || "",
      } : undefined,
      recommendedFor: [],
      capacity: data.capacity || 0,
      pointsForComplete: data.pointsToEarn || undefined,
      participants: data.slots?.[0]?.reservations?.[0].participations?.map(participation => ({
        id: participation.user?.id || "",
        name: participation.user?.name || "",
        image: participation.user?.image || null,
      })) || [],
      body: data.body || undefined,
      createdByUser: data.createdByUser ? {
        id: data.createdByUser.id,
        name: data.createdByUser.name || "",
        image: data.createdByUser.image || null,
        articlesAboutMe: data.createdByUser.articlesAboutMe ? {
          edges: data.createdByUser.articlesAboutMe.map(article => ({
            node: transformArticle(article),
          })) || [],
        } : undefined,
        opportunitiesCreatedByMe: data.createdByUser.opportunitiesCreatedByMe ? {
          edges: data.createdByUser.opportunitiesCreatedByMe
            ?.map(opportunity => opportunity)
            .map(node => transformOpportunityNode(node, data)) || [],
        } : undefined,
      } : undefined,
      place: data.place ? {
        name: data.place.name || "",
        address: data.place.address || "",
        latitude: data.place.latitude || undefined,
        longitude: data.place.longitude || undefined,
      } : undefined,
      requireApproval: data.requireApproval || undefined,
      pointsRequired: data.pointsToEarn || undefined,
      feeRequired: data.feeRequired || undefined,
      slots: presenterOpportunitySlot(data.slots)
    };
  } catch (e) {
    console.error("transformOpportunity failed", e);
    return null;
  }
};
