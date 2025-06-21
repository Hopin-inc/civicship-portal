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
import {
  OpportunityBaseDetail,
  OpportunityCard,
  OpportunityDetail,
  OpportunityHost,
} from "@/app/activities/data/type";
import { presenterArticleCard } from "@/app/articles/data/presenter";
import { presenterPlace } from "@/app/places/data/presenter";
import { addDays, isAfter } from "date-fns";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import { ActivitySlot, QuestSlot } from "@/app/reservation/data/type/opportunitySlot";

export const presenterActivityCards = (
  edges: (GqlOpportunityEdge | null | undefined)[] | null | undefined,
): OpportunityCard[] => {
  if (!edges) return [];

  return edges
    .map((edge) => edge?.node)
    .filter((node): node is GqlOpportunity => !!node)
    .map((node) => presenterActivityCard(node));
};

export const mapOpportunityCards = (edges: GqlOpportunityEdge[]): OpportunityCard[] =>
  edges
    .map((edge) => edge.node)
    .filter((node): node is GqlOpportunity => !!node)
    .map(presenterActivityCard);

export const presenterActivityCard = (node: Partial<GqlOpportunity>): OpportunityCard => {
  const base = {
    id: node?.id || "",
    title: node?.title || "",
    category: node?.category || GqlOpportunityCategory.Activity,
    location: node?.place?.name || "場所未定",
    images: node?.images || [],
    communityId: COMMUNITY_ID || "",
    hasReservableTicket: node?.isReservableWithTicket || false,
  };

  if (node?.category === GqlOpportunityCategory.Quest) {
    return {
      ...base,
      pointsToEarn: node?.pointsToEarn ?? null,
    };
  }

  return {
    ...base,
    feeRequired: node?.feeRequired ?? null,
  };
};

export const presenterActivityDetail = (data: GqlOpportunity): OpportunityDetail => {
  const { images, place, slots, articles, createdByUser, category } = data;
  const threshold = addDays(new Date(), 7);

  const isReservable = (slots ?? []).some((slot) => {
    const startsAt = slot?.startsAt ? new Date(slot.startsAt) : null;
    return startsAt ? isAfter(startsAt, threshold) : false;
  });

  const base: OpportunityBaseDetail = {
    communityId: COMMUNITY_ID || "",

    id: data.id,
    title: data.title,
    description: data.description || "",
    category,

    body: data.body || "",
    notes: "",
    images: images?.map((image) => image) || [],
    totalImageCount: images?.length || 0,

    requiredApproval: data.requireApproval,
    requiredTicket: data.requiredUtilities?.map((u) => u) || [],
    isReservable,

    place: presenterPlace(place),
    host: presenterOpportunityHost(createdByUser, articles?.[0]),

    recentOpportunities: [],
  };

  if (category === GqlOpportunityCategory.Quest) {
    return {
      ...base,
      slots: presenterQuestSlots(slots, threshold, data.pointsToEarn),
      pointsToEarn: data.pointsToEarn ?? null,
      relatedQuests: [],
    };
  }

  return {
    ...base,
    slots: presenterActivitySlots(slots, threshold, data.feeRequired),
    feeRequired: data.feeRequired ?? null,
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

function presenterQuestSlots(
  slots: Maybe<GqlOpportunitySlot[]> | undefined,
  threshold: Date,
  pointsToEarn?: Maybe<number>,
): QuestSlot[] {
  return (
    slots?.flatMap((slot): QuestSlot[] => {
      if (!slot?.startsAt) return [];

      const startsAtDate = new Date(slot.startsAt);
      const isReservable = isAfter(startsAtDate, threshold);

      return [
        {
          id: slot.id,
          startsAt: startsAtDate.toISOString(),
          endsAt: slot.endsAt ? new Date(slot.endsAt).toISOString() : "",
          capacity: slot.capacity ?? 0,
          remainingCapacity: slot.remainingCapacity ?? 0,
          applicantCount: 1,
          hostingStatus: slot.hostingStatus,
          isReservable,
          pointsToEarn: pointsToEarn ?? null,
        },
      ];
    }) ?? []
  );
}

function presenterActivitySlots(
  slots: Maybe<GqlOpportunitySlot[]> | undefined,
  threshold: Date,
  feeRequired?: Maybe<number>,
): ActivitySlot[] {
  return (
    slots?.flatMap((slot): ActivitySlot[] => {
      if (!slot?.startsAt) return [];

      const startsAtDate = new Date(slot.startsAt);
      const isReservable = isAfter(startsAtDate, threshold);

      return [
        {
          id: slot.id,
          startsAt: startsAtDate.toISOString(),
          endsAt: slot.endsAt ? new Date(slot.endsAt).toISOString() : "",
          capacity: slot.capacity ?? 0,
          remainingCapacity: slot.remainingCapacity ?? 0,
          applicantCount: 1,
          hostingStatus: slot.hostingStatus,
          isReservable,
          feeRequired: feeRequired ?? null,
        },
      ];
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
  activityCards: OpportunityCard[],
): {
  upcomingCards: OpportunityCard[];
  featuredCards: OpportunityCard[];
} => {
  const safe = <T>(cards: (T | undefined)[]): T[] => cards.filter((c): c is T => !!c);
  const hasImages = (card: OpportunityCard) => card.images && card.images.length > 0;

  const validCards = safe(activityCards.filter(hasImages));
  const featuredCards = validCards.slice(0, 3);
  const upcomingCards = validCards.slice(3);

  return { featuredCards, upcomingCards };
};
