/**
 * 支払い計算に関するユーティリティ関数
 * BigIntの安全な変換とポイント計算を提供
 */

import { toNumberSafe } from "@/utils/bigint";

/**
 * GraphQL BigInt型を安全にBigIntに変換
 * nullやundefinedの場合はnullを返す
 */
export function toBigIntSafe(value: unknown): bigint | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  
  try {
    if (typeof value === 'bigint') {
      return value;
    }
    if (typeof value === 'string') {
      return BigInt(value);
    }
    if (typeof value === 'number') {
      return BigInt(Math.floor(value));
    }
  } catch (error) {
    console.warn('[PaymentCalculations] Invalid BigInt value:', value, error);
    return null;
  }
  
  return null;
}

export { toNumberSafe };

/**
 * 必要ポイント数を計算
 */
export function calculateRequiredPoints(
  pointsPerPerson: number | null,
  participantCount: number
): number {
  if (pointsPerPerson === null || pointsPerPerson === 0) {
    return 0;
  }
  return pointsPerPerson * participantCount;
}

/**
 * 合計料金を計算
 */
export function calculateTotalFee(
  feePerPerson: number | null,
  participantCount: number,
  pointCount: number = 0
): number {
  if (feePerPerson === null) {
    return 0;
  }

  const normalParticipantCount = participantCount - pointCount;
  return feePerPerson * Math.max(0, normalParticipantCount);
}
