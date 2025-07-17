// Configuration for activity reservation deadlines
import { addDays, endOfDay, subDays } from "date-fns";

// 予約締切タイプの定義
export enum ReservationDeadlineType {
  // デフォルト: 開催7日前まで予約可能（既存の実装）
  DEFAULT = "DEFAULT",
  // 前日23:59まで予約可能
  DAY_BEFORE = "DAY_BEFORE",
  // 当日まで予約可能（開催直前まで）
  SAME_DAY = "SAME_DAY",
}

// 予約締切設定
export interface ReservationDeadlineConfig {
  // デフォルトの予約締切（開催7日前）
  defaultDeadline: () => Date;

  // 特定のスロットIDに対する予約締切タイプ
  slotDeadlineTypes: Record<string, ReservationDeadlineType>;
}

// デフォルト設定
export const RESERVATION_CONFIG: ReservationDeadlineConfig = {
  // デフォルト: 開催7日前まで（既存の実装）
  defaultDeadline: () => addDays(new Date(), 7),

  // 特定のスロットIDに対する予約締切タイプ
  slotDeadlineTypes: {
    // 例: 前日23:59まで予約可能なスロット
    // "slot-id-1": ReservationDeadlineType.DAY_BEFORE,

    // 例: 当日まで予約可能なスロット
    // "slot-id-2": ReservationDeadlineType.SAME_DAY,
    cmc07ao5c0005s60nnc8ravvk: ReservationDeadlineType.SAME_DAY,
  },
};

/**
 * 特定のスロットの予約締切日時を取得する
 * @param slotId スロットID
 * @param activityDate アクティビティの開催日
 * @returns 予約締切日時
 */
export function getReservationDeadline(
  slotId: string | null | undefined,
  activityDate: Date,
): Date {
  // スロットIDがない場合はデフォルトの締切を返す
  if (!slotId) {
    return RESERVATION_CONFIG.defaultDeadline();
  }

  // このスロットの予約締切タイプを取得
  const deadlineType =
    RESERVATION_CONFIG.slotDeadlineTypes[slotId] || ReservationDeadlineType.DEFAULT;

  // 予約締切タイプに応じて締切日時を計算
  switch (deadlineType) {
    case ReservationDeadlineType.DAY_BEFORE:
      // 前日23:59まで
      return endOfDay(subDays(activityDate, 1));

    case ReservationDeadlineType.SAME_DAY:
      // 当日まで（開催直前まで）- 開催時間の直前
      return activityDate;

    case ReservationDeadlineType.DEFAULT:
    default:
      // デフォルト: 開催7日前まで（既存の実装）
      return RESERVATION_CONFIG.defaultDeadline();
  }
}
