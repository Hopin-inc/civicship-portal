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

// Helper to get community-specific cookie name
// This mirrors the logic in TokenManager but works server-side
function getCommunitySpecificCookieName(baseName: string, communityId?: string): string {
  if (!communityId) return baseName;
  return `${baseName}_${communityId}`;
}

export async function getUserServer(communityId?: string): Promise<{
  user: GqlUser | null;
  lineAuthenticated: boolean;
  phoneAuthenticated: boolean;
}> {
  const cookieStore = await cookies();
  const hasSession = await hasServerSession();
  const cookieHeader = await getServerCookieHeader();

  // Check for community-specific LINE authentication cookie
  // Cookie names are suffixed with community ID (e.g., "line_authenticated_neo88")
  // This ensures each community has isolated authentication state
  const lineAuthCookieName = getCommunitySpecificCookieName("line_authenticated", communityId);
  const phoneAuthCookieName = getCommunitySpecificCookieName("phone_authenticated", communityId);
  
  const lineAuthenticatedCookie = cookieStore.get(lineAuthCookieName)?.value === "true";
  const phoneAuthenticated = cookieStore.get(phoneAuthCookieName)?.value === "true";

  // Using warn level temporarily to ensure logs appear in staging/production
  logger.warn("[AUTH] getUserServer: ENTRY - checking auth cookies", {
    communityId,
    hasSession,
    lineAuthCookieName,
    lineAuthenticatedCookie,
    phoneAuthCookieName,
    phoneAuthenticated,
  });

  // If there's no community-specific LINE auth cookie, treat as unauthenticated for this community
  // This ensures that logging into Community A doesn't grant access to Community B
  if (!lineAuthenticatedCookie) {
    logger.debug("[AUTH] getUserServer: no line_authenticated cookie for this community, treating as unauthenticated", {
      cookieName: lineAuthCookieName,
    });
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

    // CRITICAL FIX: If user is null despite having a session, the session might be for a different community
    // In this case, return lineAuthenticated: false to ensure redirect to login instead of phone verification
    if (!user) {
      logger.warn("[AUTH] getUserServer: Session exists but no user returned, treating as unauthenticated", {
        communityId,
        hasSession: true,
        lineAuthenticatedCookie,
      });
      return {
        user: null,
        lineAuthenticated: false,
        phoneAuthenticated: false,
      };
    }

    return {
      user,
      lineAuthenticated: true,
      phoneAuthenticated: hasPhoneIdentity,
    };
  } catch (error) {
    // CRITICAL FIX: When GraphQL query fails, return lineAuthenticated: false
    // This ensures that if the session is for a different community (causing the query to fail),
    // the user will be redirected to login instead of phone verification.
    // Previously, returning lineAuthenticated: true caused SSR to render phone verification page
    // even when the session was invalid for the current community.
    logger.warn("[AUTH] getUserServer: GraphQL query failed, treating as unauthenticated", {
      communityId,
      message: (error as Error).message,
    });
    return {
      user: null,
      lineAuthenticated: false,
      phoneAuthenticated: false,
    };
  }
}
