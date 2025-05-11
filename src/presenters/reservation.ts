"use client";

import {
  GqlTicket,
  GqlWallet,
  GqlReservation,
  GqlOpportunityCategory,
  Maybe,
} from "@/types/graphql";
import { RequiredUtility, OpportunityCard } from "@/types/opportunity";
import { ReservationDetail, ActivityField, QuestField } from "@/types/reservation";
import { ArticleWithAuthor } from "@/types/article";
import { presenterOpportunityHost } from "@/presenters/opportunity";
import { presenterPlace } from "@/presenters/place";

export const getTicketIds = (
  wallets: GqlWallet[] | null,
  requiredUtilities: RequiredUtility[] | undefined,
  ticketCount: number,
) => {
  return (
    wallets?.[0]?.tickets
      ?.filter((edge: GqlTicket) => {
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
  interview?: ArticleWithAuthor,
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
      host: presenterOpportunityHost(opportunity.createdByUser),
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
