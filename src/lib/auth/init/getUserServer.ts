import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import {
  GqlCurrentUserServerQuery,
  GqlCurrentUserServerQueryVariables,
  GqlUser,
} from "@/types/graphql";
import { cookies, headers } from "next/headers";
import { logger } from "@/lib/logging";
import { GET_CURRENT_USER_SERVER_QUERY } from "@/graphql/account/user/server";
import { getEnvCommunityId, resolveCommunityIdFromHost, getAuthForCommunity, getEnvAuthConfig } from "@/lib/communities/runtime-auth";
import type { CommunityId } from "@/lib/communities/runtime-auth";

export async function getUserServer(): Promise<{
  user: GqlUser | null;
  lineAuthenticated: boolean;
  phoneAuthenticated: boolean;
}> {
  const cookieStore = await cookies();

  const session = cookieStore.get("session")?.value ?? null;
  const hasSession = !!session;

  const phoneAuthenticated = cookieStore.get("phone_authenticated")?.value === "true";

  if (!hasSession) {
    return {
      user: null,
      lineAuthenticated: false,
      phoneAuthenticated: false,
    };
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
      GET_CURRENT_USER_SERVER_QUERY,
      {},
      { Authorization: `Bearer ${session}` },
      { tenantId, communityId }
    );

    const user: GqlUser | null = res.currentUser?.user ?? null;
    const hasPhoneIdentity = !!user?.identities?.some((i) => i.platform?.toUpperCase() === "PHONE");

    return {
      user,
      lineAuthenticated: true, // SSR時点でsessionがあればtrue扱い
      phoneAuthenticated: hasPhoneIdentity,
    };
  } catch (error) {
    logger.error("⚠️ Failed to fetch currentUser:", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    return {
      user: null,
      lineAuthenticated: true,
      phoneAuthenticated,
    };
  }
}
