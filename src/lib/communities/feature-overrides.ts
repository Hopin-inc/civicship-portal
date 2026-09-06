/**
 * Features switched on for a community from the frontend, on top of whatever
 * `communityPortalConfig.enableFeatures` returns.
 *
 * Those flags live in the API's database and no screen edits them — the
 * `updatePortalConfig` mutation behind /admin/setting does not touch
 * enableFeatures — so turning one on otherwise means a manual database change.
 * This map is the frontend's way to do it.
 *
 * Additive only. It can turn a feature on for one community; it cannot turn one
 * off. Switching a feature off is a decision about every community at once, and
 * the entry point itself is the clearer place to express that.
 */
const EXTRA_FEATURES: Record<string, readonly string[]> = {
  // neo88 wants the places tab, and its row does not list "places".
  neo88: ["places"],
};

/**
 * Returns the community's features with any frontend additions folded in.
 * Deduplicated, so a flag later added to the database does not appear twice.
 */
export function withExtraFeatures(
  communityId: string,
  enableFeatures: readonly string[],
): string[] {
  const extra = EXTRA_FEATURES[communityId];
  if (!extra) return [...enableFeatures];
  return Array.from(new Set([...enableFeatures, ...extra]));
}
