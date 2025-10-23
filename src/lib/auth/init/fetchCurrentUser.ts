import { GqlCurrentUserPayload } from "@/types/graphql";
import { logger } from "@/lib/logging";
import { User } from "firebase/auth";
import { GET_CURRENT_USER_SERVER_QUERY } from "@/graphql/account/user/server";

export async function fetchCurrentUserClient(
  firebaseUser?: User | null
): Promise<GqlCurrentUserPayload["user"] | null> {
  try {
    const authMode = firebaseUser ? "id_token" : "session";
    logger.info("🔍 [fetchCurrentUserClient] Starting GraphQL query", {
      hasWindow: typeof window !== "undefined",
      hasFirebaseUser: !!firebaseUser,
      authMode,
      endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT,
    });
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Auth-Mode": authMode,
      "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID!,
      "X-Community-Id": process.env.NEXT_PUBLIC_COMMUNITY_ID!,
    };
    
    if (firebaseUser) {
      const token = await firebaseUser.getIdToken();
      headers["Authorization"] = `Bearer ${token}`;
      logger.info("🔍 [fetchCurrentUserClient] Using ID token auth", {
        hasToken: !!token,
        tokenLength: token?.length,
      });
    } else {
      logger.info("🔍 [fetchCurrentUserClient] Using session auth");
    }
    
    logger.info("🔍 [fetchCurrentUserClient] Sending fetch request", {
      headers: Object.keys(headers),
    });
    
    const response = await fetch(process.env.NEXT_PUBLIC_API_ENDPOINT!, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({
        query: GET_CURRENT_USER_SERVER_QUERY,
        variables: {},
      }),
    });
    
    logger.info("🔍 [fetchCurrentUserClient] Fetch completed", {
      status: response.status,
      ok: response.ok,
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      logger.error("🔍 [fetchCurrentUserClient] HTTP error", {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      return null;
    }
    
    const result = await response.json();
    
    if (result.errors) {
      logger.error("🔍 [fetchCurrentUserClient] GraphQL errors", {
        errors: result.errors,
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
    logger.error("🔍 [fetchCurrentUserClient] Request failed", {
      error: error instanceof Error ? error.message : String(error),
      errorType: error?.constructor?.name,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
}
