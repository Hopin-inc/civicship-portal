import { logger } from "@/lib/logging";

/**
 * Activity booking configuration
 * Maps activity IDs to their advance booking requirements (in days)
 */
export interface ActivityBookingConfig {
  [activityId: string]: number;
}

// NOTE: 現段階では、どこまで日程受付の日数カスタムニーズあるか読めないので、データベースではなく環境変数経由で設定・参照している
// NOTE: BE では同じ値を CloudRun にて ACTIVITY_ADVANCE_BOOKING_DAYS_CONFIG という環境変数に設定する

// 環境変数からの設定を読み込む
// 環境変数のJSON形式例: {"activity-id-1":0,"activity-id-2":1,"activity-id-3":7}
let configFromEnv: ActivityBookingConfig = {};
try {
  if (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ACTIVITY_ADVANCE_BOOKING_DAYS_CONFIG) {
    configFromEnv = JSON.parse(process.env.NEXT_PUBLIC_ACTIVITY_ADVANCE_BOOKING_DAYS_CONFIG);
    logger.info('Loaded activity advance booking days config from environment variable');
    logger.info('Activity advance booking days config:', configFromEnv);
  }
} catch (error) {
  logger.error('Error parsing NEXT_PUBLIC_ACTIVITY_ADVANCE_BOOKING_DAYS_CONFIG environment variable:', error);
}

// 環境変数からの設定のみを使用
export const ACTIVITY_BOOKING_CONFIG: ActivityBookingConfig = configFromEnv;

/**
 * Default advance booking days for activities without specific configuration
 */
export const DEFAULT_ADVANCE_BOOKING_DAYS = 7;

/**
 * Default cancellation deadline days before activity start
 */
export const DEFAULT_CANCELLATION_DEADLINE_DAYS = 1;

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
