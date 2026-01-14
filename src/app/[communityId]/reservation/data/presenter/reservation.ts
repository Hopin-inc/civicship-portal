"use client";

import {
  GqlOpportunityCategory,
  GqlReservation,
  GqlTicket,
  GqlWallet,
  Maybe,
} from "@/types/graphql";
import { OpportunityCard, RequiredUtility } from "@/components/domains/opportunities/types";
import {
  ActivityField,
  QuestField,
  ReservationDetail,
} from "@/app/[communityId]/reservation/data/type/reservation";
import { TArticleWithAuthor } from "@/app/[communityId]/articles/data/type";
import { presenterPlace } from "@/app/[communityId]/places/data/presenter";
import { presenterOpportunityHost } from "@/components/domains/opportunities/data/presenter";
import { getCommunityIdFromEnv } from "@/lib/communities/config";

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
  const diff = startsAt.getTime() - now.getTime();
  return diff >= 24 * 60 * 60 * 1000; // 24時間以上あるか
};

const getCancelDue = (startsAt?: Date | null): string | undefined => {
  if (!startsAt) return undefined;

  const cancelDate = new Date(startsAt.getTime() - 24 * 60 * 60 * 1000);
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
