"use client";

import {
  GqlArticle,
  GqlOpportunity,
  GqlOpportunityCategory,
  GqlOpportunityEdge,
  GqlOpportunitySlot,
  GqlReservation,
  GqlUser,
  Maybe,
} from "@/types/graphql";
import { ActivityCard, ActivityDetail, OpportunityHost } from "@/app/activities/data/type";
import { presenterArticleCard } from "@/app/articles/data/presenter";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";
import { presenterPlace } from "@/app/places/data/presenter";

export const presenterActivityCards = (
  edges: (GqlOpportunityEdge | null | undefined)[] | null | undefined,
): ActivityCard[] => {
  if (!edges) return [];

  return edges
    .map((edge) => edge?.node)
    .filter((node): node is GqlOpportunity => !!node)
    .map((node) => presenterActivityCard(node));
};

export const presenterActivityCard = (node: GqlOpportunity): ActivityCard => ({
  id: node?.id || "",
  title: node?.title || "",
  category: node?.category || GqlOpportunityCategory.Activity,
  feeRequired: node?.feeRequired || 0,
  location: node?.place?.name || "場所未定",
  images: node?.images || [],
  communityId: node?.community?.id || "",
  hasReservableTicket: node?.isReservableWithTicket || false,
});

export const presenterActivityDetail = (data: GqlOpportunity): ActivityDetail => {
  const { images, place, slots, articles, createdByUser } = data;

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
    requiredTicket: data.requiredUtilities?.map((u) => u) || [],
    feeRequired: data.feeRequired || 0,

    place: presenterPlace(place),
    host: presenterOpportunityHost(createdByUser, articles?.[0]),
    slots: presenterActivitySlot(slots, data.feeRequired),

    recentOpportunities: [],
    reservableTickets: [],
    relatedActivities: [],
  };
};

export function presenterOpportunityHost(
  host?: Maybe<GqlUser> | undefined,
  interview?: GqlArticle,
): OpportunityHost {
  return {
    id: host?.id || "",
    name: host?.name || "",
    image: host?.image || "",
    bio: host?.bio || "",
    interview: presenterArticleCard(interview || host?.articlesAboutMe?.[0]),
  };
}

function presenterActivitySlot(
  slots: Maybe<GqlOpportunitySlot[]> | undefined,
  feeRequired?: Maybe<number> | undefined,
): ActivitySlot[] {
  return (
    slots?.map(
      (slot): ActivitySlot => ({
        id: slot?.id,
        hostingStatus: slot?.hostingStatus,
        startsAt: slot?.startsAt ? new Date(slot.startsAt).toISOString() : "",
        endsAt: slot?.endsAt ? new Date(slot.endsAt).toISOString() : "",
        capacity: slot?.capacity ?? 0,
        remainingCapacity: slot?.remainingCapacity ?? 0,
        feeRequired: feeRequired ?? null,
        applicantCount: 1,
      }),
    ) ?? []
  );
}

export const presenterReservationDateTimeInfo = (
  opportunitySlot: GqlOpportunitySlot,
  opportunity: GqlOpportunity,
  reservation: GqlReservation,
) => {
  const startDate = new Date(opportunitySlot.startsAt);
  const endDate = new Date(opportunitySlot.endsAt);

  const participantCount = reservation.participations?.length || 0;

  return {
    formattedDate: startDate.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }),
    startTime: startDate.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    endTime: endDate.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
    participantCount,
    totalPrice: (opportunity.feeRequired || 0) * participantCount,
  };
};

export const sliceActivitiesBySection = (
  activityCards: ActivityCard[],
): {
  upcomingCards: ActivityCard[];
  featuredCards: ActivityCard[];
  listCards: ActivityCard[];
} => {
  const safe = <T>(cards: (T | undefined)[]): T[] => cards.filter((c): c is T => !!c);

  const N = activityCards.length;

  // Filter activities with images
  const hasImages = (card: ActivityCard) => card.images && card.images.length > 0;

  // Sort function to put cards with images first
  const sortByImages = (cards: ActivityCard[]) => {
    return [...cards].sort((a, b) => {
      const aHasImages = hasImages(a);
      const bHasImages = hasImages(b);

      if (aHasImages && !bHasImages) return -1;
      if (!aHasImages && bHasImages) return 1;
      return 0;
    });
  };

  const featuredHead = activityCards[0];

  if (N < 10) {
    const maxUpcoming = N >= 6 ? 3 : 2;

    const usedIndices = new Set<number>();
    if (featuredHead) usedIndices.add(0);

    // Only include activities with images in featuredCards
    const featuredCards = safe([featuredHead]).filter(hasImages);

    const upcomingCards = safe(
      activityCards.slice(1, 1 + maxUpcoming).map((card, i) => {
        usedIndices.add(i + 1);
        return card;
      }),
    );

    // Get remaining cards and sort them - activities with images first
    const listCards = sortByImages(safe(activityCards.filter((_, idx) => !usedIndices.has(idx))));

    return { upcomingCards, featuredCards, listCards };
  }

  const featuredTail = activityCards.slice(6, 10);
  // Only include activities with images in featuredCards
  const featuredCards = safe([featuredHead, ...featuredTail]).filter(hasImages);

  const upcomingCards = safe(activityCards.slice(1, 6));

  // Get all list cards and sort them - activities with images first
  const listCards = sortByImages(
    safe([...activityCards.slice(3, 6), ...activityCards.slice(6, 10), ...activityCards.slice(10)]),
  );

  return { upcomingCards, featuredCards, listCards };
};
