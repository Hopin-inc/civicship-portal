import { headers } from "next/headers";
import { logger } from "@/lib/logging";

/**
 * Server Component / Server utilities 用
 * headers() から communityId を取得
 *
 * @returns communityId or null if not found
 */
export async function getCommunityIdFromHeader(): Promise<string | null> {
  const headersList = await headers();
  const communityId = headersList.get("x-community-id");

  logger.debug("[getCommunityIdFromHeader] Reading from headers", {
    communityId: communityId ?? "(null)",
    hasHeader: !!communityId,
    component: "getCommunityIdFromHeader",
  });

  return communityId;
}
