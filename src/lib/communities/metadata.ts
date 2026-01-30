import { ACTIVE_COMMUNITY_IDS } from "@/lib/communities/constants";

export function getCommunityIdFromEnv(): string {
  const communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID;

  if (!communityId) {
    console.warn("COMMUNITY_ID environment variable is not set. Using default community settings.");
    return "himeji-ymca";
  }
  const isActiveCommunity = (ACTIVE_COMMUNITY_IDS as readonly string[]).includes(communityId);

  if (!isActiveCommunity) {
    console.warn(
      `COMMUNITY_ID "${communityId}" is not configured. Using default community settings.`,
    );
    return "himeji-ymca";
  }
  return communityId;
}

export const COMMUNITY_ID = getCommunityIdFromEnv();
