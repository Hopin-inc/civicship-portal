"use client";

import {
  GqlOpportunityCategory,
  GqlReservation,
  GqlTicket,
  GqlWallet,
  Maybe,
} from "@/types/graphql";
import { OpportunityCard, RequiredUtility } from "@/app/activities/data/type";
import {
  ActivityField,
  QuestField,
  ReservationDetail,
} from "@/app/reservation/data/type/reservation";
import { TArticleWithAuthor } from "@/app/articles/data/type";
import { presenterPlace } from "@/app/places/data/presenter";
import { presenterOpportunityHost } from "@/app/activities/data/presenter";
import { getCommunityIdFromEnv } from "@/lib/communities/metadata";

export const getTicketIds = (
  wallets: GqlWallet[] | null,
  requiredUtilities: RequiredUtility[] | undefined,
  ticketCount: number,
) => {
  return (
    wallets
      ?.find((w) => w.community?.id === getCommunityIdFromEnv())
      ?.tickets?.filter((edge: GqlTicket) => {
        if (!requiredUtilities?.length) return true;
        const utilityId = edge?.utility?.id;
        return utilityId && requiredUtilities.some((u) => u.id === utilityId);
      })
      ?.slice(0, ticketCount)
      ?.map((edge: GqlTicket) => edge?.id)
      ?.filter((id) => id !== undefined) || []
  );
};

export const getEmergencyContactPhone = (reservation: GqlReservation): string | undefined => {
  return reservation.createdByUser?.phoneNumber || undefined;
};

export const presenterReservationDetail = (
  reservation: GqlReservation,
  interview?: TArticleWithAuthor,
  relatedOpportunities: OpportunityCard[] = [],
): ReservationDetail => {
  const slot = reservation.opportunitySlot;
  if (!slot) throw new Error("Reservation must include opportunitySlot");

  const opportunity = slot.opportunity;
  if (!opportunity) throw new Error("OpportunitySlot must include opportunity");

  const category = opportunity.category;
  if (!category) throw new Error("Opportunity must have a category");

  const participantsCount = slot.reservations?.flatMap((r) => r.participations || []).length || 0;
  const base = {
    id: reservation.id,
    communityId: opportunity.community?.id || "",
    status: reservation.status,
    date: slot.startsAt.toISOString() || "",
    participantsCount,
    opportunity: {
      id: opportunity.id,
      title: opportunity.title,
      images: opportunity.images || [],
      host: presenterOpportunityHost(opportunity.createdByUser, opportunity.articles?.[0]),
    },
    images: opportunity.images || [],
    totalImageCount: opportunity.images?.length || 0,
    place: presenterPlace(opportunity.place),

    interview,
    relatedOpportunity: relatedOpportunities,
    isCancelable: getIsCancelable(slot.startsAt),
    cancelDue: getCancelDue(slot.startsAt),
  };

  switch (category) {
    case GqlOpportunityCategory.Activity:
      return {
        ...base,
        category,
        ...presenterActivityFields(participantsCount, opportunity.feeRequired),
      };

    case GqlOpportunityCategory.Quest:
      return {
        ...base,
        category,
        ...presenterQuestFields(participantsCount, opportunity.pointsToEarn),
      };

    default:
      throw new Error(`Unsupported category: ${category}`);
  }
};

const getIsCancelable = (startsAt?: Date | null): boolean => {
  if (!startsAt) return false;

  const now = new Date();

  // 開催日の0時0分0秒を取得（前日23:59:59までキャンセル可能）
  const cancelDeadline = new Date(startsAt);
  cancelDeadline.setHours(0, 0, 0, 0);

  return now < cancelDeadline;
};

const getCancelDue = (startsAt?: Date | null): string | undefined => {
  if (!startsAt) return undefined;

  // 開催日の前日23:59:59を計算
  const cancelDate = new Date(startsAt);
  cancelDate.setHours(0, 0, 0, 0); // 開催日の0時0分0秒
  cancelDate.setMilliseconds(-1); // 1ミリ秒前 = 前日の23:59:59.999

  return cancelDate.toISOString();
};

const presenterActivityFields = (
  participantsCount: number,
  feeRequired?: Maybe<number> | undefined,
): ActivityField => {
  if (feeRequired == null) {
    throw new Error("Missing ActivityField values");
  }

  return {
    feeRequired,
    totalFeeRequired: feeRequired * participantsCount,
  };
};

const presenterQuestFields = (
  participantsCount: number,
  pointsToEarn?: Maybe<number> | undefined,
): QuestField => {
  if (pointsToEarn == null) {
    throw new Error("Missing QuestField values");
  }

  return {
    pointsToEarn,
    totalPointsToEarn: pointsToEarn * participantsCount,
  };
};
