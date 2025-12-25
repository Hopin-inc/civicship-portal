import { GqlOpportunity, GqlReservation } from "@/types/graphql";
import { isPointsOnlyOpportunity } from "@/utils/opportunity/isPointsOnlyOpportunity";
import { PriceInfo } from "@/app/admin/reservations/types";

/**
 * 予約の料金情報を計算してプレゼンテーション用のデータに変換
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
