import {
  GqlOpportunity,
  GqlOpportunityCategory,
  GqlOpportunityEdge,
  GqlOpportunitySlot,
  Maybe,
} from "@/types/graphql";
import { QuestCard, QuestDetail } from "@/app/activities/data/type";
import { presenterPlace } from "@/app/places/data/presenter";
import { presenterOpportunityHost } from "@/app/activities/data/presenter";
import { QuestSlot } from "@/app/reservation/data/type/opportunitySlot";
import { addDays, isAfter } from "date-fns";
import { COMMUNITY_ID } from "@/utils";

export const presenterQuestCards = (
  edges: (GqlOpportunityEdge | null | undefined)[] | null | undefined,
): QuestCard[] => {
  if (!edges) return [];

  return edges
    .map((edge) => edge?.node)
    .filter((node): node is GqlOpportunity => !!node)
    .map((node) => presenterQuestCard(node));
};

export const mapQuestCards = (edges: GqlOpportunityEdge[]): QuestCard[] =>
  edges
    .map((edge) => edge.node)
    .filter((node): node is GqlOpportunity => !!node)
    .map(presenterQuestCard);

export const presenterQuestCard = (node: GqlOpportunity): QuestCard => {
  return {
    id: node?.id || "",
    title: node?.title || "",
    category: node?.category || GqlOpportunityCategory.Quest,
    pointsToEarn: node?.pointsToEarn ?? null,
    location: node?.place?.name || "場所未定",
    images: node?.images || [],
    communityId: COMMUNITY_ID || "",
    hasReservableTicket: node?.isReservableWithTicket || false,
  };
};

export const presenterQuestDetail = (data: GqlOpportunity): QuestDetail => {
  const { images, place, slots, articles, createdByUser } = data;
  const threshold = addDays(new Date(), 7);

  const questSlots = presenterQuestSlot(slots, threshold, data.pointsToEarn);
  const isReservable = questSlots.some((slot) => slot.isReservable);

  return {
    communityId: COMMUNITY_ID || "",
    id: data.id,
    title: data.title,
    description: data.description || "",
    body: data.body || "",
    notes: "",
    images: images?.map((image) => image) || [],
    totalImageCount: images?.length || 0,

    requiredApproval: data.requireApproval,
    requiredTicket: data.requiredUtilities?.map((u) => u) || [],

    isReservable,

    place: presenterPlace(place),
    host: presenterOpportunityHost(createdByUser, articles?.[0]),
    slots: presenterQuestSlot(slots, threshold, data.pointsToEarn),

    recentOpportunities: [],
    relatedQuests: [],
  };
};

function presenterQuestSlot(
  slots: Maybe<GqlOpportunitySlot[]> | undefined,
  threshold: Date,
  pointsToEarn?: Maybe<number> | undefined,
): QuestSlot[] {
  return (
    slots?.map((slot): QuestSlot => {
      const startsAtDate = slot?.startsAt ? new Date(slot.startsAt) : null;

      const isReservable = startsAtDate ? isAfter(startsAtDate, threshold) : false;

      return {
        id: slot?.id,
        hostingStatus: slot?.hostingStatus,
        startsAt: startsAtDate?.toISOString() || "",
        endsAt: slot?.endsAt ? new Date(slot.endsAt).toISOString() : "",
        capacity: slot?.capacity ?? 0,
        remainingCapacity: slot?.remainingCapacity ?? 0,
        pointsToEarn: pointsToEarn ?? null,
        applicantCount: 1,
        isReservable,
      };
    }) ?? []
  );
}

export const sliceQuestsBySection = (
  questCards: QuestCard[],
): {
  upcomingCards: QuestCard[];
  featuredCards: QuestCard[];
  listCards: QuestCard[];
} => {
  const safe = <T>(cards: (T | undefined)[]): T[] => cards.filter((c): c is T => !!c);

  const N = questCards.length;

  const hasImages = (card: QuestCard) => card.images && card.images.length > 0;

  const sortByImages = (cards: QuestCard[]) => {
    return [...cards].sort((a, b) => {
      const aHasImages = hasImages(a);
      const bHasImages = hasImages(b);

      if (aHasImages && !bHasImages) return -1;
      if (!aHasImages && bHasImages) return 1;
      return 0;
    });
  };

  const featuredHead = questCards[0];

  if (N < 10) {
    const maxUpcoming = N >= 6 ? 3 : 2;

    const usedIndices = new Set<number>();
    if (featuredHead) usedIndices.add(0);

    const featuredCards = safe([featuredHead]).filter(hasImages);

    const upcomingCards = safe(
      questCards.slice(1, 1 + maxUpcoming).map((card, i) => {
        usedIndices.add(i + 1);
        return card;
      }),
    );

    const listCards = sortByImages(safe(questCards.filter((_, idx) => !usedIndices.has(idx))));

    return { upcomingCards, featuredCards, listCards };
  }

  const featuredTail = questCards.slice(6, 10);
  const featuredCards = safe([featuredHead, ...featuredTail]).filter(hasImages);

  const upcomingCards = safe(questCards.slice(1, 6));

  const listCards = sortByImages(
    safe([...questCards.slice(3, 6), ...questCards.slice(6, 10), ...questCards.slice(10)]),
  );

  return { upcomingCards, featuredCards, listCards };
};
