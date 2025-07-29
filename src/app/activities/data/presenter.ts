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
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { getReservationThreshold } from "@/app/reservation/data/presenter/opportunitySlot";
import { format, isAfter } from "date-fns";
import { getCrossDayLabel } from "@/utils/date";
import { ja } from "date-fns/locale";

export const presenterActivityCards = (
  edges: (GqlOpportunityEdge | null | undefined)[] | null | undefined,
): ActivityCard[] => {
  if (!edges) return [];

  return edges
    .map((edge) => edge?.node)
    .filter((node): node is GqlOpportunity => !!node)
    .map((node) => presenterActivityCard(node));
};

export const mapOpportunityCards = (edges: GqlOpportunityEdge[]): ActivityCard[] =>
  edges
    .map((edge) => edge.node)
    .filter((node): node is GqlOpportunity => !!node)
    .map(presenterActivityCard);

export const presenterActivityCard = (node: Partial<GqlOpportunity>): ActivityCard => {
  return {
    id: node?.id || "",
    title: node?.title || "",
    category: node?.category || GqlOpportunityCategory.Activity,
    feeRequired: node?.feeRequired ?? null,
    location: node?.place?.name || "場所未定",
    images: node?.images || [],
    communityId: COMMUNITY_ID || "",
    hasReservableTicket: node?.isReservableWithTicket || false,
  };
};

export const presenterActivityDetail = (data: GqlOpportunity): ActivityDetail => {
  const { images, place, slots, articles, createdByUser } = data;
  const threshold = getReservationThreshold(data.id);

  const activitySlots = presenterActivitySlot(slots, threshold, data.feeRequired);
  const isReservable = activitySlots.some((slot) => slot.isReservable);

  return {
    communityId: COMMUNITY_ID || "",
    id: data.id,
    title: data.title,
    description: data.description || "",
    body: data.body || "",
    notes: "",
    images: images?.map((image) => image) || [],
    totalImageCount: images?.length || 0,

    requireApproval: data.requireApproval,
    targetUtilities: data.requiredUtilities?.map((u) => u) ?? [],
    feeRequired: data.feeRequired ?? null,

    isReservable,

    place: presenterPlace(place),
    host: presenterOpportunityHost(createdByUser, articles?.[0]),
    slots: activitySlots,

    recentOpportunities: [],
    reservableTickets: [],
    relatedActivities: [],
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
  threshold: Date,
  feeRequired?: Maybe<number> | undefined,
): ActivitySlot[] => {
  return (
    slots?.map((slot): ActivitySlot => {
      const startsAtDate = slot?.startsAt ? new Date(slot.startsAt) : null;

      const isReservable = startsAtDate
        ? isAfter(startsAtDate, threshold)
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

export const presenterReservationDateTimeInfo = (
  opportunitySlot: GqlOpportunitySlot,
  opportunity: GqlOpportunity,
  reservation: GqlReservation,
) => {
  const startDate = new Date(opportunitySlot.startsAt);
  const endDate = new Date(opportunitySlot.endsAt);

  const participantCount = reservation.participations?.length || 0;
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
    totalPrice: (opportunity.feeRequired ?? 0) * paidParticipantCount,
  };
};

export const sliceActivitiesBySection = (
  activityCards: ActivityCard[],
): {
  upcomingCards: ActivityCard[];
  featuredCards: ActivityCard[];
} => {
  const safe = <T>(cards: (T | undefined)[]): T[] => cards.filter((c): c is T => !!c);
  const hasImages = (card: ActivityCard) => card.images && card.images.length > 0;

  const validCards = safe(activityCards.filter(hasImages));
  const featuredCards = validCards.slice(0, 3);
  const upcomingCards = validCards.slice(3);

  return { featuredCards, upcomingCards };
};
