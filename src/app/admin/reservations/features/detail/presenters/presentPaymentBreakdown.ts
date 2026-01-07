import { GqlOpportunity, GqlReservation } from "@/types/graphql";

export type PaymentType = "FEE_ONLY" | "POINT_ONLY" | "MIXED";

export interface PaymentBreakdown {
  // 現金払い
  feePayerCount: number;
  totalFee: number;
  feePerPerson: number;

  // ポイント払い
  pointPayerCount: number;
  totalPoints: number;
  pointsPerPerson: number;

  // 合計
  totalParticipants: number;

  // 支払いタイプ
  paymentType: PaymentType;
}

/**
 * 支払い方法の内訳を計算
 */
export function presentPaymentBreakdown(
  reservation: GqlReservation,
  opportunity: GqlOpportunity,
): PaymentBreakdown {
  const totalParticipants = reservation.participations?.length || 0;
  const pointPayerCount = reservation.participantCountWithPoint || 0;
  const feePayerCount = totalParticipants - pointPayerCount;

  const feePerPerson = opportunity.feeRequired || 0;
  const pointsPerPerson = opportunity.pointsRequired || 0;

  const totalFee = feePerPerson * feePayerCount;
  const totalPoints = pointsPerPerson * pointPayerCount;

  // 支払いタイプを判定
  const paymentType: PaymentType =
    pointPayerCount === 0
      ? "FEE_ONLY"
      : pointPayerCount === totalParticipants
      ? "POINT_ONLY"
      : "MIXED";

  return {
    feePayerCount,
    totalFee,
    feePerPerson,
    pointPayerCount,
    totalPoints,
    pointsPerPerson,
    totalParticipants,
    paymentType,
  };
}
