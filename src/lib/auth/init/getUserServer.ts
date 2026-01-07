import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import {
  GqlCurrentUserServerQuery,
  GqlCurrentUserServerQueryVariables,
  GqlUser,
} from "@/types/graphql";
import { cookies } from "next/headers";
import { logger } from "@/lib/logging";
import { GET_CURRENT_USER_SERVER_QUERY } from "@/graphql/account/user/server";
import { hasServerSession, getServerCookieHeader } from "@/lib/auth/server/session";

export async function getUserServer(communityId?: string): Promise<{
  user: GqlUser | null;
  lineAuthenticated: boolean;
  phoneAuthenticated: boolean;
}> {
  const cookieStore = await cookies();
  const hasSession = await hasServerSession();
  const cookieHeader = await getServerCookieHeader();

  // Check for per-community LINE authentication cookie
  // The line_authenticated cookie is set with path=/${communityId}/ when the user logs in
  // This ensures each community has isolated authentication state
  const lineAuthenticatedCookie = cookieStore.get("line_authenticated")?.value === "true";
  const phoneAuthenticated = cookieStore.get("phone_authenticated")?.value === "true";

  logger.debug("[AUTH] getUserServer: checking auth cookies", {
    communityId,
    hasSession,
    lineAuthenticatedCookie,
    phoneAuthenticated,
  });

  // If there's no per-community LINE auth cookie, treat as unauthenticated for this community
  // This ensures that logging into Community A doesn't grant access to Community B
  if (!lineAuthenticatedCookie) {
    logger.debug("[AUTH] getUserServer: no line_authenticated cookie for this community, treating as unauthenticated");
    return {
      user: null,
      lineAuthenticated: false,
      phoneAuthenticated: false,
    };
  }

  if (!hasSession) {
    return {
      user: null,
      lineAuthenticated: false,
      phoneAuthenticated: false,
    };
  }

  const headers: Record<string, string> = {};
  if (cookieHeader) {
    headers.cookie = cookieHeader;
  }
  if (communityId) {
    headers["X-Community-Id"] = communityId;
  }

  try {
    const res = await executeServerGraphQLQuery<
      GqlCurrentUserServerQuery,
      GqlCurrentUserServerQueryVariables
    >(GET_CURRENT_USER_SERVER_QUERY, {}, headers);

    const user: GqlUser | null = res.currentUser?.user ?? null;
    const hasPhoneIdentity = !!user?.identities?.some((i) => i.platform?.toUpperCase() === "PHONE");

    return {
      user,
      lineAuthenticated: true, // SSR時点でsessionがあればtrue扱い
      phoneAuthenticated: hasPhoneIdentity,
    };
  } catch (error) {
    logger.warn("⚠️ Failed to fetch currentUser:", {
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
