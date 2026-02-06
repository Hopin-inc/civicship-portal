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
import { ActivityCard, ActivityDetail, OpportunityHost, QuestCard, QuestDetail } from "@/components/domains/opportunities/types";
import { presenterArticleCard } from "@/app/community/[communityId]/articles/data/presenter";
import { ActivitySlot, QuestSlot } from "@/app/community/[communityId]/reservation/data/type/opportunitySlot";
import { presenterPlace } from "@/app/community/[communityId]/places/data/presenter";
import { isDateReservable } from "@/app/community/[communityId]/reservation/data/presenter/opportunitySlot";
import { format, isAfter } from "date-fns";
import { getCrossDayLabel } from "@/utils/date";
import { ja } from "date-fns/locale";

export const presenterActivityCards = (
  edges: (GqlOpportunityEdge | null | undefined)[] | null | undefined,
  communityId: string | null,
): ActivityCard[] => {
  if (!edges) return [];

  return edges
    .map((edge) => edge?.node)
    .filter((node): node is GqlOpportunity => !!node)
    .map((node) => presenterActivityCard(node, communityId));
};

export const presenterQuestCards = (
  edges: (GqlOpportunityEdge | null | undefined)[] | null | undefined,
  communityId: string | null,
): QuestCard[] => {
  if (!edges) return [];

  return edges
    .map((edge) => edge?.node)
    .filter((node): node is GqlOpportunity => !!node)
    .map((node) => presenterQuestCard(node, communityId));
};
export const mapOpportunityCards = (
  edges: GqlOpportunityEdge[],
  communityId: string | null,
): (ActivityCard | QuestCard)[] =>
  edges
    .map((edge) => edge.node)
    .filter((node): node is GqlOpportunity => !!node)
    .map((node) => {
      if (node.category === GqlOpportunityCategory.Activity) {
        return presenterActivityCard(node, communityId);
      } else if (node.category === GqlOpportunityCategory.Quest) {
        return presenterQuestCard(node, communityId);
      }
      return null;
    })
    .filter((v): v is ActivityCard | QuestCard => v !== null);

export const presenterActivityCard = (
  node: Partial<GqlOpportunity>,
  communityId: string | null,
): ActivityCard => {
  return {
    id: node?.id || "",
    title: node?.title || "",
    category: node?.category || GqlOpportunityCategory.Activity,
    feeRequired: node?.feeRequired ?? null,
    location: node?.place?.name || "場所未定",
    images: node?.images || [],
    communityId: communityId,
    hasReservableTicket: node?.isReservableWithTicket || false,
    pointsRequired: node?.pointsRequired ?? null,
    slots: node?.slots ?? [],
  };
};

export const presenterQuestCard = (
  node: Partial<GqlOpportunity>,
  communityId: string | null,
): QuestCard => {
  return {
    id: node?.id || "",
    title: node?.title || "",
    category: node?.category || GqlOpportunityCategory.Quest,
    location: node?.place?.name || "場所未定",
    images: node?.images || [],
    communityId: communityId,
    hasReservableTicket: node?.isReservableWithTicket || false,
    pointsToEarn: node?.pointsToEarn ?? 0,
    slots: node?.slots ?? [],
    pointsRequired: node?.pointsRequired ?? null,
  };
};

export const presenterActivityDetail = (
  data: GqlOpportunity,
  communityId: string | null,
): ActivityDetail => {
  const { images, place, slots, articles, createdByUser } = data;

  const activitySlots = presenterActivitySlot(slots, data.id, data.feeRequired);
  const isReservable = activitySlots.some((slot) => slot.isReservable);

  return {
    communityId: communityId,
    id: data.id,
    title: data.title,
    description: data.description || "",
    body: data.body || "",
    notes: "",
    images: images?.map((image) => image) || [],
    totalImageCount: images?.length || 0,
    category: data.category,
    requireApproval: data.requireApproval,
    targetUtilities: data.requiredUtilities?.map((u) => u) ?? [],
    feeRequired: data.feeRequired ?? null,

    isReservable,
    pointsRequired: data.pointsRequired ?? 0,
    place: presenterPlace(place),
    host: presenterOpportunityHost(createdByUser, articles?.[0]),
    slots: activitySlots,

    recentOpportunities: [],
    reservableTickets: [],
    relatedActivities: [],
  };
};

export const presenterQuestDetail = (
  data: GqlOpportunity,
  communityId: string | null,
): QuestDetail => {
  const { images, place, slots, articles, createdByUser } = data;

  const activitySlots = presenterActivitySlot(slots, data.id, data.feeRequired);
  const isReservable = activitySlots.some((slot) => slot.isReservable);

  return {
    communityId: communityId,
    id: data.id,
    title: data.title,
    description: data.description || "",
    body: data.body || "",
    notes: "",
    images: images?.map((image) => image) || [],
    totalImageCount: images?.length || 0,
    category: data.category,
    requireApproval: data.requireApproval,
    targetUtilities: data.requiredUtilities?.map((u) => u) ?? [],
    isReservable,

    place: presenterPlace(place),
    host: presenterOpportunityHost(createdByUser, articles?.[0]),
    slots: presenterQuestSlot(slots, data.id),

    pointsToEarn: data.pointsToEarn ?? 0,
    pointsRequired: data.pointsRequired ?? 0,
    relatedQuests: [],
    recentOpportunities: [],
  };
};

export function presenterOpportunityHost(
  host?: Maybe<GqlUser> | undefined,
  interview?: GqlArticle,
): OpportunityHost {
  const selectedInterview = interview ?? host?.articlesAboutMe?.[0];

  return {
    id: host?.id || "",
    name: host?.name || "",
    image: host?.image || "",
    bio: host?.bio || "",
    interview: selectedInterview ? presenterArticleCard(selectedInterview) : undefined,
  };
}

export const presenterActivitySlot = (
  slots: Maybe<GqlOpportunitySlot[]> | undefined,
  activityId?: string,
  feeRequired?: Maybe<number> | undefined,
): ActivitySlot[] => {
  return (
    slots?.map((slot): ActivitySlot => {
      const startsAtDate = slot?.startsAt ? new Date(slot.startsAt) : null;

      const isReservable = startsAtDate
        ? isDateReservable(startsAtDate, activityId)
        : false;

      return {
        id: slot?.id,
        opportunityId: slot.opportunity?.id || "",
        hostingStatus: slot?.hostingStatus,
        startsAt: startsAtDate?.toISOString() || "",
        endsAt: slot?.endsAt ? new Date(slot.endsAt).toISOString() : "",
        capacity: slot?.capacity ?? 0,
        remainingCapacity: slot?.remainingCapacity ?? 0,
        feeRequired: feeRequired ?? null,
        applicantCount: 1,
        isReservable,
      };
    }) ?? []
  );
}

function presenterQuestSlot(
  slots: Maybe<GqlOpportunitySlot[]> | undefined,
  activityId?: string,
  feeRequired?: Maybe<number> | undefined,
): QuestSlot[] {
  const SLOT_IDS_TO_FORCE_RESERVABLE = ["cmc07ao5c0005s60nnc8ravvk"];

  return (
    slots?.map((slot): QuestSlot => {
      const startsAtDate = slot?.startsAt ? new Date(slot.startsAt) : null;

      const isForceReservable = slot?.id && SLOT_IDS_TO_FORCE_RESERVABLE.includes(slot.id);

      // 通常の条件 or 強制フラグ
      const isReservable = isForceReservable
        ? true
        : startsAtDate
          ? isDateReservable(startsAtDate, activityId)
          : false;

      return {
        id: slot?.id,
        hostingStatus: slot?.hostingStatus,
        startsAt: startsAtDate?.toISOString() || "",
        endsAt: slot?.endsAt ? new Date(slot.endsAt).toISOString() : "",
        capacity: slot?.capacity ?? 0,
        remainingCapacity: slot?.remainingCapacity ?? 0,
        applicantCount: 1,
        isReservable,
        pointsToEarn: 0,
      };
    }) ?? []
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
  const discountToPoints = reservation.participantCountWithPoint ? reservation.participantCountWithPoint * (opportunity.feeRequired ?? 0) : 0;
  const paidTicketIds =
    reservation.participations
      ?.map((p) => p.ticketStatusHistories?.map((h) => h.ticket?.id))
      .flat()
      .filter((ticketId) => ticketId !== undefined) ?? [];
  const paidParticipantCount = participantCount - [...new Set(paidTicketIds)].length;

  return {
    formattedDate: format(startDate, "yyyy年M月d日(E)", { locale: ja }),
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
    dateDiffLabel: getCrossDayLabel(startDate, endDate),
    participantCount,
    paidParticipantCount,
    totalPrice: (opportunity.feeRequired ?? 0) * paidParticipantCount - discountToPoints,
    usedPoints: reservation.participantCountWithPoint ? reservation.participantCountWithPoint * (opportunity.pointsRequired ?? 0) : 0,
    participantCountWithPoint: reservation.participantCountWithPoint ?? 0,
    ticketCount: paidTicketIds.length,
  };
};

export const sliceOpportunitiesBySection = (
  cards: (ActivityCard | QuestCard)[],
): {
  upcomingCards: (ActivityCard | QuestCard)[];
  featuredCards: (ActivityCard | QuestCard)[];
} => {
  const safe = <T>(cards: (T | undefined)[]): T[] => cards.filter((c): c is T => !!c);
  const hasImages = (card: ActivityCard | QuestCard) => card.images && card.images.length > 0;

  const isBookable = (card: ActivityCard | QuestCard): boolean => {
    return card.slots?.some(slot => {
      if (slot.hostingStatus !== "SCHEDULED") return false;
      return isDateReservable(slot.startsAt, card.id);
    }) ?? false;
  };

  const validCards = safe(cards.filter(hasImages));
  
  // Filter to only include bookable cards
  const bookableCards = validCards.filter(isBookable);
  
  // Take up to 3 cards for featured section
  const featuredCards = bookableCards.slice(0, 3);
  
  // Remaining bookable cards go to upcoming section
  const upcomingCards = bookableCards.slice(3);

  return { featuredCards, upcomingCards };
};
