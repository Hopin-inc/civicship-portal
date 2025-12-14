/**
 * Edge-safe community ID utilities.
 * This file must NOT import any server-only modules as it's used in middleware.
 */

/**
 * List of valid community IDs.
 * This is the single source of truth for community validation.
 */
export const VALID_COMMUNITY_IDS = [
  "neo88",
  "kibotcha",
  "dais",
  "kotohira",
  "himeji-ymca",
  "izu",
] as const;

/**
 * Type representing a valid community ID.
 */
export type CommunityId = (typeof VALID_COMMUNITY_IDS)[number];

/**
 * Check if a string is a valid community ID.
 * This function is safe to use in Edge Runtime (middleware).
 */
export function isValidCommunityId(communityId: string): communityId is CommunityId {
  return VALID_COMMUNITY_IDS.includes(communityId as CommunityId);
}
