"use client";

import {
  GqlArticle,
  GqlOpportunity,
  GqlOpportunityCategory,
  GqlOpportunityEdge,
  GqlOpportunitySlot,
  GqlPlace,
  GqlUser,
  Maybe,
} from "@/types/graphql";
import {
  ActivityCard,
  ActivityDetail,
  OpportunityHost,
  OpportunityPlace,
} from "@/app/activities/data/type";
import { presenterArticleCard } from "@/app/articles/data/presenter";
import { ActivitySlot } from "@/app/reservation/data/type/opportunitySlot";
import { presenterPlace } from "@/app/places/data/presenter/place";

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
  const { images, place, slots, articles, createdByUser, ...prop } = data;

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
    interview: presenterArticleCard(interview),
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
      }),
    ) ?? []
  );
}

export const sliceActivitiesBySection = (
  activityCards: ActivityCard[]
): {
  upcomingCards: ActivityCard[];
  featuredCards: ActivityCard[];
  listCards: ActivityCard[];
} => {
  const safe = <T>(cards: (T | undefined)[]): T[] =>
    cards.filter((c): c is T => !!c);

  const N = activityCards.length;

  const featuredHead = activityCards[0];

  if (N < 10) {
    const maxUpcoming = N >= 6 ? 3 : 2;

    const usedIndices = new Set<number>();
    if (featuredHead) usedIndices.add(0);

    const featuredCards = safe([featuredHead]);

    const upcomingCards = safe(
      activityCards
        .slice(1, 1 + maxUpcoming)
        .map((card, i) => {
          usedIndices.add(i + 1);
          return card;
        })
    );

    const listCards = safe(
      activityCards.filter((_, idx) => !usedIndices.has(idx))
    );

    return { upcomingCards, featuredCards, listCards };
  }

  const featuredTail = activityCards.slice(6, 10);
  const featuredCards = safe([featuredHead, ...featuredTail]);

  const upcomingCards = safe(activityCards.slice(1, 6));

  const listCards = safe([
    ...activityCards.slice(3, 6),
    ...activityCards.slice(6, 10),
    ...activityCards.slice(10),
  ]);

  return { upcomingCards, featuredCards, listCards };
};


