"use client";

import {
  GqlOpportunityCategory,
  GqlOpportunitySlotHostingStatus,
  GqlParticipation,
  GqlReservationStatus,
  Maybe,
} from "@/types/graphql";
import {
  ActivityField,
  ParticipationDetail,
  ParticipationInfo,
  ParticipationOptionalInfo,
  QuestField,
} from "@/app/participations/[id]/data/type";
import { ReservationStatus } from "@/types/participationStatus";
import { presenterPlace } from "@/app/places/data/presenter";
import { presenterOpportunityHost } from "@/app/activities/data/presenter";
import { subDays } from "date-fns";

export const presenterParticipation = (raw: GqlParticipation): ParticipationDetail => {
  if (
    !raw ||
    !raw.reservation ||
    !raw.reservation.opportunitySlot ||
    !raw.reservation.opportunitySlot.opportunity
  ) {
    throw new Error("参加情報に必要なデータが不足しています");
  }

  const reservation = raw.reservation;
  const slot = reservation.opportunitySlot;
  const opportunity = slot?.opportunity;

  const category = opportunity?.category;
  if (!category) throw new Error("Opportunity must have a category");

  const participantsCount = reservation.participations?.length ?? 0;

  const base: ParticipationInfo = {
    id: raw.id,
    communityId: opportunity.community?.id ?? "",
    status: raw.status,
    reason: raw.reason,

    opportunity: {
      id: opportunity.id,
      title: opportunity.title,
      images: opportunity.images ?? [],
      host: presenterOpportunityHost(opportunity.createdByUser),
    },

    emergencyContactPhone: opportunity?.createdByUser?.phoneNumber ?? "",

    slot: {
      id: slot?.id || "",
      status: slot?.hostingStatus || GqlOpportunitySlotHostingStatus.Cancelled,
      startsAt: new Date(slot?.startsAt ?? ""),
      endsAt: new Date(slot?.endsAt ?? ""),
    },

    reservation: {
      id: reservation.id,
      status: reservation.status as GqlReservationStatus,
    },

    images: raw.images ?? [],
    totalImageCount: (raw.images ?? []).length,
    participantsCount,
    place: presenterPlace(opportunity.place),
  };

  const optional: ParticipationOptionalInfo = {
    isCancelable: getIsCancelable(slot?.startsAt),
    cancelDue: getCancelDue(slot?.startsAt),
  };

  switch (category) {
    case GqlOpportunityCategory.Activity: {
      const feeRequired = opportunity.feeRequired ?? 0;
      const activityFields: ActivityField = {
        feeRequired,
        totalFeeRequired: feeRequired * participantsCount,
      };

      return {
        ...base,
        ...optional,
        ...activityFields,
        category,
      };
    }

    case GqlOpportunityCategory.Quest: {
      const pointsToEarn = opportunity.pointsToEarn ?? 0;
      const questFields: QuestField = {
        pointsToEarn,
        totalPointsToEarn: pointsToEarn * participantsCount,
      };

      return {
        ...base,
        ...optional,
        ...questFields,
        category,
      };
    }

    default:
      throw new Error(`Unsupported category: ${category}`);
  }
};

const getIsCancelable = (startsAt?: Date | string | null): boolean => {
  if (!startsAt) return false;

  const startDate = typeof startsAt === "string" ? new Date(startsAt) : startsAt;
  const now = new Date();
  const diff = startDate.getTime() - now.getTime();
  return diff >= 24 * 60 * 60 * 1000; // 24時間以上あるか
};

const getCancelDue = (startsAt?: Date | string | null): string | undefined => {
  if (!startsAt) return undefined;

  const startDate = typeof startsAt === "string" ? new Date(startsAt) : startsAt;
  const cancelDate = new Date(startDate.getTime() - 24 * 60 * 60 * 1000);
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

export const getStatusInfo = (status: GqlReservationStatus): ReservationStatus | null => {
  switch (status) {
    case GqlReservationStatus.Applied:
      return {
        status: GqlReservationStatus.Applied,
        statusText: "案内人による承認待ちです。",
        statusSubText: "承認されると、予約が確定します。",
        statusClass: "bg-yellow-50 border-yellow-200",
      };
    case GqlReservationStatus.Accepted:
      return {
        status: GqlReservationStatus.Accepted,
        statusText: "予約が確定しました。",
        statusSubText: "",
        statusClass: "bg-green-50 border-green-200",
      };
    case GqlReservationStatus.Canceled:
      return {
        status: GqlReservationStatus.Canceled,
        statusText: "予約がキャンセルされました。",
        statusSubText: "予約のキャンセルが完了しました。",
        statusClass: "bg-red-50 border-red-200",
      };
    case GqlReservationStatus.Rejected:
      return {
        status: GqlReservationStatus.Rejected,
        statusText: "開催が中止されました。",
        statusSubText: "案内人の都合により中止となりました。",
        statusClass: "bg-red-50 border-red-200",
      };
    default:
      return null;
  }
};

export const calculateCancellationDeadline = (startTime?: Date): Date | null => {
  if (!startTime) return null;
  return subDays(startTime, 7); // ← 7日前
};
