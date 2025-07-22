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
import { ActivityCard, ActivityDetail, OpportunityHost, QuestCard, QuestDetail } from "@/app/activities/data/type";
import { presenterArticleCard } from "@/app/articles/data/presenter";
import { ActivitySlot, QuestSlot } from "@/app/reservation/data/type/opportunitySlot";
import { presenterPlace } from "@/app/places/data/presenter";
import { COMMUNITY_ID } from "@/lib/communities/metadata";
import {
  getReservationThreshold,
} from "@/app/reservation/data/presenter/opportunitySlot";
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

export const presenterQuestCards = (
  edges: (GqlOpportunityEdge | null | undefined)[] | null | undefined,
): QuestCard[] => {
  if (!edges) return [];

  return edges
    .map((edge) => edge?.node)
    .filter((node): node is GqlOpportunity => !!node)
    .map((node) => presenterQuestCard(node));
};
export const mapOpportunityCards = (edges: GqlOpportunityEdge[]): (ActivityCard | QuestCard)[] =>
  edges
    .map((edge) => edge.node)
    .filter((node): node is GqlOpportunity => !!node)
    .map((node) => {
      if (node.category === GqlOpportunityCategory.Activity) {
        return presenterActivityCard(node);
      } else if (node.category === GqlOpportunityCategory.Quest) {
        return presenterQuestCard(node);
      }
      return null;
    })
    .filter((v): v is ActivityCard | QuestCard => v !== null);

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
    pointsToRequired: node?.pointsToRequired ?? null,
    slots: node?.slots ?? [],
  };
};

export const presenterQuestCard = (node: Partial<GqlOpportunity>): QuestCard => {
  return {
    id: node?.id || "",
    title: node?.title || "",
    category: node?.category || GqlOpportunityCategory.Quest,
    location: node?.place?.name || "場所未定",
    images: node?.images || [],
    communityId: COMMUNITY_ID || "",
    hasReservableTicket: node?.isReservableWithTicket || false,
    pointsToEarn: node?.pointsToEarn ?? 0,
    slots: node?.slots ?? [],
    pointsToRequired: node?.pointsToRequired ?? null,
  };
};

export const presenterActivityDetail = (data: GqlOpportunity): ActivityDetail => {
  const { images, place, slots, articles, createdByUser } = data;
  const threshold = getReservationThreshold();

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
    category: data.category,
    requireApproval: data.requireApproval,
    targetUtilities: data.requiredUtilities?.map((u) => u) ?? [],
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

export const presenterQuestDetail = (data: GqlOpportunity): QuestDetail => {
  const { images, place, slots, articles, createdByUser } = data;
  const threshold = getReservationThreshold();

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
    category: data.category,
    requireApproval: data.requireApproval,
    targetUtilities: data.requiredUtilities?.map((u) => u) ?? [],
    isReservable,

    place: presenterPlace(place),
    host: presenterOpportunityHost(createdByUser, articles?.[0]),
    slots: presenterQuestSlot(slots, threshold),

    pointsToEarn: data.pointsToEarn ?? 0,
    relatedQuests: [],
    recentOpportunities: [],
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
  const SLOT_IDS_TO_FORCE_RESERVABLE = ["cmc07ao5c0005s60nnc8ravvk","cmajo3nfj001es60nltawe4a6"];

  return (
    slots?.map((slot): ActivitySlot => {
      const startsAtDate = slot?.startsAt ? new Date(slot.startsAt) : null;

      const isForceReservable = slot?.id && SLOT_IDS_TO_FORCE_RESERVABLE.includes(slot.id);

      // 通常の条件 or 強制フラグ
      const isReservable = isForceReservable
        ? true
        : startsAtDate
          ? isAfter(startsAtDate, threshold)
          : false;

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
        opportunityId: slot?.opportunity?.id || "",
      };
    }) ?? []
  );
}

function presenterQuestSlot(
  slots: Maybe<GqlOpportunitySlot[]> | undefined,
  threshold: Date,
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
          ? isAfter(startsAtDate, threshold)
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
  cards: (ActivityCard | QuestCard)[],
): {
  upcomingCards: (ActivityCard | QuestCard)[];
  featuredCards: (ActivityCard | QuestCard)[];
} => {
  const safe = <T>(cards: (T | undefined)[]): T[] => cards.filter((c): c is T => !!c);
  const hasImages = (card: ActivityCard | QuestCard) => card.images && card.images.length > 0;

  const validCards = safe(cards.filter(hasImages));
  const featuredCards = validCards.slice(0, 3);
  const upcomingCards = validCards.slice(3);

  return { featuredCards, upcomingCards };
};
