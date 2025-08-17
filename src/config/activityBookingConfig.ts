/**
 * Activity booking configuration
 * Maps activity IDs to their advance booking requirements (in days)
 */
export interface ActivityBookingConfig {
  [activityId: string]: number;
}

// NOTE: 環境変数だと JSON がうまく渡らず、コードで直接定義している
// NOTE: BE では同じ値を CloudRun にて ACTIVITY_ADVANCE_BOOKING_DAYS_CONFIG という環境変数に設定している

/**
 * Activity booking configuration
 * Directly defined in code instead of using environment variables
 * Format: { "activity-id": days }
 */
export const ACTIVITY_BOOKING_CONFIG: ActivityBookingConfig = {
  // 例: 当日予約可能なアクティビティ
  // "activity-workshop-456": 0,
  // 例: 3日前までの予約が必要なアクティビティ
  // "activity-workshop-456": 3,
  // 例: 14日前までの予約が必要なアクティビティ
  // "activity-special-789": 14,
  // === for production ===
  "cmahtdrqu0036s60nag2bvzzu": 1, // ［８５］ちいさなデザイナーの1日体験
  "cmaw8y9om00o0s60nexftxrz9": 1, // ［７］安心素材で備える未来のごはん
  "cmdl3fjqo000007lbfs035ew0": 0, // 琴平×まんのう 竹あかりプロジェクト
  "cmd5ein2s000ls60esmi6mg94": 0, // 電動アシスト付きe-bikeでうどん屋巡り！うどんタクシードライバーがおすすめする穴場うどん店を紹介！
  "cmd5eczx5000hs60et7bqvo3t": 0, // :beers:酔いどれ社長と行く！琴平まちなかバルホッピングツアー
  "cmd5e86b9000fs60ektp6snb6": 0, // うどんタクシー“格さん”と行く！讃岐うどん食べ歩き＆うどん打ち体験スペシャルツアー
  "cmajlrsq4000ds60n8kr7d6rx": 1, // ［１７］ほたるの里で味わう夏の川遊び体験
  "cmajrg00h0031s60notq3ash8": 1, // ［３４］宮司と唱えるひふみ祝詞と、御守り体験
  "cmaoctvav0029s60nr45s27bj": 1, // ［５７］道後の湯あがりに一杯！ビール工場見学
  "cmee4z2ii000bs60e41et8krq": 0, // ショート動画制作を覚えて 地域(お店)の発信力を上げよう！
  "cmb3a6qny01hcs60ncbsokqz8": 0, // ［８］藍ある暮らしに触れる
  // === for development ===
  "cmdoet4xa002ds60e7f5akwcb": 0,
  "cmdoesowc002bs60eytbbxkxe": 1,
  "cmdoerhjc0029s60efbb4ub0m": 2
};

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
