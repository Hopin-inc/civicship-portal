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

  const phoneAuthenticated = cookieStore.get("phone_authenticated")?.value === "true";

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

    // If user is null despite having a session, the session might be for a different community
    // In this case, return lineAuthenticated: false to ensure redirect to login instead of phone verification
    if (!user) {
      logger.warn("[AUTH] getUserServer: Session exists but no user returned, treating as unauthenticated", {
        communityId,
        hasSession: true,
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
    // When GraphQL query fails, return lineAuthenticated: false
    // This ensures that if the session is for a different community (causing the query to fail),
    // the user will be redirected to login instead of phone verification.
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
