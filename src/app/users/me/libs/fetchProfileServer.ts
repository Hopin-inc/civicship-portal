import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import {
  GqlCurrentUserServerQuery,
  GqlCurrentUserServerQueryVariables,
  GqlUser,
} from "@/types/graphql";
import { cookies, headers } from "next/headers";
import { logger } from "@/lib/logging";
import { FETCH_PROFILE_SERVER_QUERY } from "@/graphql/account/user/server";
import { getEnvCommunityId, resolveCommunityIdFromHost, getAuthForCommunity, getEnvAuthConfig } from "@/lib/communities/runtime-auth";
import type { CommunityId } from "@/lib/communities/runtime-auth";

export async function fetchProfileServer(): Promise<GqlUser | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value ?? null;
  const hasSession = !!session;

  if (!hasSession) {
    return null;
  }

  const headersList = headers();
  const host = headersList.get("host") ?? "localhost";
  const envCommunityId = getEnvCommunityId();
  const communityId = envCommunityId ?? resolveCommunityIdFromHost(host);
  
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
