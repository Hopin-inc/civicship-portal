/**
 * Environment-based community configuration utilities
 * These functions are safe to use in middleware and edge runtime
 * because they only read from environment variables
 */

/**
 * Get community ID from environment variable
 */
export function getCommunityIdFromEnv(): string {
  const communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID;
  if (!communityId) {
    console.warn("NEXT_PUBLIC_COMMUNITY_ID is not set, using 'default'");
    return "default";
  }
  return communityId;
}

/**
 * Get enabled features from environment variable
 * Used in middleware and i18n where React context is not available
 */
export function getEnabledFeaturesFromEnv(): string[] {
  const features = process.env.NEXT_PUBLIC_ENABLE_FEATURES;
  if (!features) {
    return [];
  }
  return features.split(",").map((f) => f.trim()).filter(Boolean);
}

/**
 * Get root path from environment variable
 * Used in middleware where React context is not available
 */
export function getRootPathFromEnv(): string {
  return process.env.NEXT_PUBLIC_ROOT_PATH || "/";
}
