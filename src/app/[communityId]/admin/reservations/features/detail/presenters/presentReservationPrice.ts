import { GqlOpportunity, GqlReservation } from "@/types/graphql";
import { isPointsOnlyOpportunity } from "@/utils/opportunity/isPointsOnlyOpportunity";
import { PriceInfo } from "@/app/[communityId]/admin/reservations/types";

/**
 * 予約の料金情報を計算
 */
export function presentReservationPrice(
  reservation: GqlReservation,
  opportunity: GqlOpportunity,
): PriceInfo {
  const participantCount = reservation.participations?.length || 0;
  const feeRequired = opportunity.feeRequired ?? 0;
  const pointsRequired = opportunity.pointsRequired ?? 0;
  const pointsToEarn = opportunity.pointsToEarn ?? 0;

  const participationFee = feeRequired * participantCount;
  const totalPointsRequired = pointsRequired * participantCount;
  const totalPointsToEarn = pointsToEarn * participantCount;
  const isPointsOnly = isPointsOnlyOpportunity(feeRequired, pointsRequired);

  return {
    participationFee,
    participantCount,
    pointsRequired,
    totalPointsRequired,
    isPointsOnly,
    category: opportunity.category,
    pointsToEarn,
    totalPointsToEarn,
  };
}

/**
 * 承認に必要なポイントを計算
 */
export function calculateRequiredPointsForApproval(
  participantCount: number,
  pointsToEarn: number,
): number {
  return participantCount * pointsToEarn;
}

/**
 * 出席確認に必要なポイントを計算
 */
export function calculateRequiredPointsForAttendance(
  passedCount: number,
  pointsToEarn: number,
): number {
  return passedCount * pointsToEarn;
}
