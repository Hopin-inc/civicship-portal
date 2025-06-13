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
import { addDays, isAfter } from "date-fns";
import { COMMUNITY_ID } from "@/lib/communities/metadata";

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
  const threshold = addDays(new Date(), 7);

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

    requiredApproval: data.requireApproval,
    requiredTicket: data.requiredUtilities?.map((u) => u) || [],
    feeRequired: data.feeRequired ?? null,

    isReservable,

    place: presenterPlace(place),
    host: presenterOpportunityHost(createdByUser, articles?.[0]),
    slots: presenterActivitySlot(slots, threshold, data.feeRequired),

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
  threshold: Date,
  feeRequired?: Maybe<number> | undefined,
): ActivitySlot[] {
  return (
    slots?.map((slot): ActivitySlot => {
      const startsAtDate = slot?.startsAt ? new Date(slot.startsAt) : null;

      // 7日以内 → false、8日以降 → true
      const isReservable = startsAtDate ? isAfter(startsAtDate, threshold) : false;

      return {
        id: slot?.id,
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
  const paidTicketIds = reservation.participations
    ?.map((p => p.ticketStatusHistories?.map(h => h.ticket?.id)))
    .flat()
    .filter(ticketId => ticketId !== undefined) ?? [];
  const paidParticipantCount = participantCount - [...new Set(paidTicketIds)].length;
  console.log("!!!", reservation.participations);

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

  const N = activityCards.length;
  const hasImages = (card: ActivityCard) => card.images && card.images.length > 0;

  if (N === 0) {
    return { upcomingCards: [], featuredCards: [] };
  }

  const featuredHead = activityCards[0];
  const featuredCards = safe(hasImages(featuredHead) ? [featuredHead] : []);

  const maxUpcoming = N >= 6 ? 3 : 2;
  const upcomingRaw = activityCards.slice(1, 1 + maxUpcoming);
  const upcomingCards = safe(upcomingRaw.filter(hasImages));

  return { upcomingCards, featuredCards };
};
