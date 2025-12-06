/**
 * 予約バリデーション結果
 */
export interface ReservationValidation {
  isButtonDisabled: boolean;
  disabledReason: string | null;
}

/**
 * 予約の入力値をバリデーション
 *
 * @param creatingReservation - 予約作成中かどうか
 * @param hasInsufficientPoints - ポイントが不足しているかどうか
 * @returns バリデーション結果
 */
export function validateReservation(
  creatingReservation: boolean,
  hasInsufficientPoints: boolean,
): ReservationValidation {
  if (creatingReservation) {
    return {
      isButtonDisabled: true,
      disabledReason: "申込処理中",
    };
  }

  if (hasInsufficientPoints) {
    return {
      isButtonDisabled: true,
      disabledReason: "ポイントが不足しているため申し込みできません",
    };
  }

  return {
    isButtonDisabled: false,
    disabledReason: null,
  };
}
