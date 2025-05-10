'use client';

import {
  GqlArticle,
  GqlOpportunity,
  GqlOpportunityCategory, GqlOpportunitySlot, GqlPlace, GqlUser,
  Maybe,
} from "@/types/graphql";
import { ActivityCard, ActivityDetail, ActivitySlot, OpportunityHost, OpportunityPlace } from "@/types/opportunity";
import { presenterArticleCard } from "@/presenters/article";

export const presenterActivityCard = (node: Maybe<GqlOpportunity> | undefined ): ActivityCard => ({
  id: node?.id || "",
  title: node?.title || "",
  category: node?.category || GqlOpportunityCategory.Activity,
  feeRequired: node?.feeRequired || 0,
  location: node?.place?.name || '場所未定',
  images: node?.images || [],
  communityId: node?.community?.id || '',
  hasReservableTicket: node?.isReservableWithTicket || false,
});

export const presenterActivityDetail = (data: GqlOpportunity): ActivityDetail=> {
  const {images, place, slots, articles, createdByUser, ...prop} = data;

  return {
    communityId: data.community?.id || "",

    id: data.id,
    title: data.title,
    description: data.description || "",
    body: data.body || "",
    notes: "",
    images: images?.map((image) => image) || [],
    totalImageCount: images?.length || 0,

    requiredApproval: data.requireApproval,
    feeRequired: data.feeRequired || 0,

    place: presenterPlace(place),
    host: presenterOpportunityHost(createdByUser, articles?.[0]),
    slots: presenterActivitySlot(slots, data.feeRequired),

    recentOpportunities: [],
    reservableTickets: [],
    relatedActivities: [],
  };
};

function presenterPlace(place?: Maybe<GqlPlace>): OpportunityPlace {
  return {
    id: place?.id || "",
    name: place?.name || "",
    description: "",
    address: place?.address || "",
    latitude: place?.latitude ?? undefined,
    longitude: place?.longitude ?? undefined,
  }
}

function presenterOpportunityHost(host?: Maybe<GqlUser> | undefined, interview?: GqlArticle): OpportunityHost {
  return {
    id: host?.id || "",
    name: host?.name || "",
    image: host?.image || "",
    bio: host?.bio || "",
    interview: presenterArticleCard(interview)
  }
}

function presenterActivitySlot(slots:  Maybe<GqlOpportunitySlot[]> | undefined, feeRequired?: Maybe<number> | undefined ): ActivitySlot[] {
  return (
    slots?.map((slot): ActivitySlot => ({
      id: slot?.id ?? "",
      startsAt: slot?.startsAt
        ? new Date(slot.startsAt).toISOString()
        : "",
      endsAt: slot?.endsAt
        ? new Date(slot.endsAt).toISOString()
        : "",
      capacity: slot?.capacity ?? 0,
      remainingCapacity: slot?.remainingCapacity ?? 0,
      feeRequired: feeRequired ?? 0,
    })) ?? []
  );
}