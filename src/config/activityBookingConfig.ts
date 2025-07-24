/**
 * Activity booking configuration
 * Maps activity IDs to their advance booking requirements (in days)
 */
export interface ActivityBookingConfig {
  [activityId: string]: number;
}

export const ACTIVITY_BOOKING_CONFIG: ActivityBookingConfig = {
  // Add activity-specific configurations here
  // Example configurations:
  // "activity-urgent-123": 1,         // 1 day advance booking
  // "activity-workshop-456": 14,      // 14 days advance booking
  // "activity-special-789": 3,        // 3 days advance booking
  "cmddfyrc301nh2fddhizez1vk": 1,
};

/**
 * Default advance booking days for activities without specific configuration
 */
export const DEFAULT_ADVANCE_BOOKING_DAYS = 7;

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
  return `${days}日前`;
};
