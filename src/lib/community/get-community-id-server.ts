import { headers } from "next/headers";
import { logger } from "@/lib/logging";

/**
 * Server Component / Server utilities 用
 * headers() から communityId を取得
 *
 * @throws Error if x-community-id header is not found
 */
export async function getCommunityIdFromHeader(): Promise<string> {
  const headersList = await headers();
  const communityId = headersList.get("x-community-id");

  logger.debug("[getCommunityIdFromHeader] Reading from headers", {
    communityId,
    hasHeader: !!communityId,
    component: "getCommunityIdFromHeader",
  });

  if (!communityId) {
    logger.error("[getCommunityIdFromHeader] No x-community-id header found", {
      component: "getCommunityIdFromHeader",
      availableHeaders: Array.from(headersList.keys()),
    });
    throw new Error("No community ID found in headers");
  }

  return communityId;
}

/**
 * Server Component / Server utilities 用（オプショナル版）
 * headers() から communityId を取得、なければ null を返す
 */
export async function getCommunityIdFromHeaderOptional(): Promise<string | null> {
  try {
    const headersList = await headers();
    const communityId = headersList.get("x-community-id");

    logger.debug("[getCommunityIdFromHeaderOptional] Reading from headers", {
      communityId,
      hasHeader: !!communityId,
      component: "getCommunityIdFromHeaderOptional",
    });

    return communityId;
  } catch (error) {
    logger.warn("[getCommunityIdFromHeaderOptional] Failed to read headers", {
      error: error instanceof Error ? error.message : String(error),
      component: "getCommunityIdFromHeaderOptional",
    });
    return null;
  }
}
