import { GqlCurrentUserPayload } from "@/types/graphql";
import { logger } from "@/lib/logging";
import { GET_CURRENT_USER_SERVER_QUERY } from "@/graphql/account/user/server";

export async function fetchCurrentUserClient(): Promise<GqlCurrentUserPayload["user"] | null> {
  try {
    logger.info("🔍 [fetchCurrentUserClient] Fetching user from GraphQL API");
    
    const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Auth-Mode": "session",
        "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID!,
        "X-Community-Id": process.env.NEXT_PUBLIC_COMMUNITY_ID!,
      },
      credentials: "include", // セッションCookieを送信
      body: JSON.stringify({
        query: GET_CURRENT_USER_SERVER_QUERY,
        variables: {},
      }),
    });

    if (!response.ok) {
      logger.error("🔍 [fetchCurrentUserClient] HTTP error", {
        status: response.status,
        statusText: response.statusText,
      });
      return null;
    }

    const result = await response.json();
    
    if (result.errors) {
      logger.error("🔍 [fetchCurrentUserClient] GraphQL errors", {
        errors: result.errors.map((e: any) => e.message),
      });
      return null;
    }

    const user = result.data?.currentUser?.user ?? null;
    logger.info("🔍 [fetchCurrentUserClient] GraphQL response received", {
      hasData: !!result.data,
      hasCurrentUser: !!result.data?.currentUser,
      hasUser: !!user,
      userId: user?.id,
      identitiesCount: user?.identities?.length ?? 0,
    });
    
    return user;
  } catch (error) {
    logger.error("🔍 [fetchCurrentUserClient] GraphQL query failed", {
      error: error instanceof Error ? error.message : String(error),
      errorType: error?.constructor?.name,
    });
    return null;
  }
}
