import { GqlOpportunityCategory } from "@/types/graphql";
import { ActivityDetail, QuestDetail } from "@/components/domains/opportunities/types";
import { isPointsOnlyOpportunity } from "@/utils/opportunity/isPointsOnlyOpportunity";
import { ReservationWallet } from "@/app/reservation/confirm/presenters/presentReservationConfirm";

/**
 * 予約確認画面で使用する計算済みデータ
 */
export interface ReservationCalculations {
  feeRequired: number | null;
  pointsRequired: number;
  isActivity: boolean;
  isQuest: boolean;
  isPointsOnly: boolean;
  totalPointsRequired: number;
  hasInsufficientPoints: boolean;
}

/**
 * 機会情報と参加者数から必要な計算を実行
 * 
 * @param opportunity - 機会情報
 * @param wallet - ウォレット情報
 * @param participantCount - 参加者数
 * @returns 計算結果
 */
export function calculateReservationDetails(
  opportunity: ActivityDetail | QuestDetail | null,
  wallet: ReservationWallet | null,
  participantCount: number,
): ReservationCalculations {
  if (!opportunity) {
    return {
      feeRequired: null,
      pointsRequired: 0,
      isActivity: false,
      isQuest: false,
      isPointsOnly: false,
      totalPointsRequired: 0,
      hasInsufficientPoints: false,
    };
  }

  const feeRequired = "feeRequired" in opportunity ? opportunity.feeRequired : null;
  const pointsRequired = "pointsRequired" in opportunity ? opportunity.pointsRequired : 0;
  const isActivity = opportunity.category === GqlOpportunityCategory.Activity;
  const isQuest = opportunity.category === GqlOpportunityCategory.Quest;
  const isPointsOnly = isActivity && isPointsOnlyOpportunity(feeRequired, pointsRequired);
  const totalPointsRequired = pointsRequired * participantCount;
  const userPoint = wallet?.currentPoint ?? null;
  const hasInsufficientPoints = isPointsOnly && (userPoint === null || userPoint < totalPointsRequired);

  return {
    feeRequired,
    pointsRequired,
    isActivity,
    isQuest,
    isPointsOnly,
    totalPointsRequired,
    hasInsufficientPoints,
  };
}

/**
 * 支払い金額を計算
 *
 * @param feeRequired - 1人あたりの料金
 * @param participantCount - 参加者数
 * @param paidWithPoints - ポイントで支払う人数
 * @returns 合計支払い金額
 */
export function calculateTotalPrice(
  feeRequired: number | null,
  participantCount: number,
  paidWithPoints: number,
): number {
  if (feeRequired === null || feeRequired === 0) return 0;
  const paidParticipants = participantCount - paidWithPoints;
  return feeRequired * Math.max(0, paidParticipants);
}

/**
 * 消費ポイントを計算
 * 
 * @param pointsRequired - 1人あたりの必要ポイント
 * @param paidWithPoints - ポイントで支払う人数
 * @returns 合計消費ポイント
 */
export function calculateTotalPoints(
  pointsRequired: number,
  paidWithPoints: number,
): number {
  return pointsRequired * paidWithPoints;
}
