/**
 * ポイント専用の活動かどうかを判定
 * @param feeRequired 料金（nullまたは0の場合は無料）
 * @param pointsRequired 必要ポイント数
 * @returns ポイント専用ならtrue
 */
export function isPointsOnlyOpportunity(
  feeRequired: number | null | undefined,
  pointsRequired: number | null | undefined
): boolean {
  const fee = feeRequired ?? 0;
  const points = pointsRequired ?? 0;
  return (!fee || fee === 0) && points > 0;
}
