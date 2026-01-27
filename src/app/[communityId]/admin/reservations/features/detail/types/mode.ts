/**
 * 予約詳細ページのモード
 */
export type ReservationMode = "approval" | "attendance" | "cancellation";

/**
 * 文字列がReservationModeかチェック
 */
export function isReservationMode(value: string | null): value is ReservationMode {
  return value === "approval" || value === "attendance" || value === "cancellation";
}
