/**
 * Activity booking configuration
 * Maps activity IDs to their advance booking requirements (in days)
 */
export interface ActivityBookingConfig {
  [activityId: string]: number;
}

// NOTE: BE では CloudRun にて ACTIVITY_ADVANCE_BOOKING_DAYS_CONFIG 環境変数を同様に設定している

/**
 * Activity booking configuration
 * 現在は一律設定のため個別設定なし
 * 必要に応じて個別アクティビティIDと日数を設定可能
 * Format: { "activity-id": days }
 */
export const ACTIVITY_BOOKING_CONFIG: ActivityBookingConfig = {
};

/**
 * Default advance booking days for activities without specific configuration
 */
export const DEFAULT_ADVANCE_BOOKING_DAYS = 2;

/**
 * Default cancellation deadline days before activity start
 */
export const DEFAULT_CANCELLATION_DEADLINE_DAYS = 2;

/**
 * Get the advance booking days for a specific activity
 * @param activityId The activity ID to get booking lead time for
 * @returns Number of days in advance booking is required
 */
export const getAdvanceBookingDays = (activityId?: string): number => {
  if (!activityId) {
    return DEFAULT_ADVANCE_BOOKING_DAYS;
  }
  
  return ACTIVITY_BOOKING_CONFIG[activityId] ?? DEFAULT_ADVANCE_BOOKING_DAYS;
};

/**
 * Get the advance booking text for UI display
 * @param activityId The activity ID to get booking lead time text for
 * @returns Formatted text for UI display (e.g., "7日前", "1日前")
 */
export const getAdvanceBookingText = (activityId?: string): string => {
  const days = getAdvanceBookingDays(activityId);
  return days === 0 ? "当日" : `${days}日前`;
};
