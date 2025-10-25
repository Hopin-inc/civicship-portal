import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import {
  GqlCurrentUserServerQuery,
  GqlCurrentUserServerQueryVariables,
  GqlUser,
} from "@/types/graphql";
import { cookies } from "next/headers";
import { logger } from "@/lib/logging";
import { FETCH_PROFILE_SERVER_QUERY } from "@/graphql/account/user/server";
import { getCommunityIdFromRequest } from "@/lib/communities/server-resolve";
import { getAuthForCommunity, getEnvAuthConfig } from "@/lib/communities/runtime-auth";

export async function fetchProfileServer(): Promise<GqlUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value ?? null;
  const hasSession = !!session;

  if (!hasSession) {
    return null;
  }

  const communityId = getCommunityIdFromRequest();
  
  const envAuth = getEnvAuthConfig();
  const tenantId = envAuth.tenantId ?? getAuthForCommunity(communityId).tenantId;

  try {
    const res = await executeServerGraphQLQuery<
      GqlCurrentUserServerQuery,
      GqlCurrentUserServerQueryVariables
    >(
      FETCH_PROFILE_SERVER_QUERY,
      {},
      { Authorization: `Bearer ${session}` },
      { tenantId, communityId }
    );

    return res.currentUser?.user ?? null;
  } catch (error) {
    logger.error("⚠️ Failed to fetch user (SSR flexible):", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    return null;
  }
}
