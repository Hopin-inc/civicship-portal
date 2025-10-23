import { CurrentUserServerDocument, GqlCurrentUserPayload } from "@/types/graphql";
import { apolloClient } from "@/lib/apollo";
import { logger } from "@/lib/logging";
import { User } from "firebase/auth";

export async function fetchCurrentUserClient(
  firebaseUser?: User | null
): Promise<GqlCurrentUserPayload["user"] | null> {
  try {
    const authMode = firebaseUser ? "id_token" : "session";
    logger.info("🔍 [fetchCurrentUserClient] Starting GraphQL query", {
      hasWindow: typeof window !== "undefined",
      apolloClientExists: !!apolloClient,
      hasFirebaseUser: !!firebaseUser,
      authMode,
    });
    
    const headers: Record<string, string> = {
      "X-Auth-Mode": authMode,
      "X-Civicship-Tenant": process.env.NEXT_PUBLIC_FIREBASE_AUTH_TENANT_ID!,
      "X-Community-Id": process.env.NEXT_PUBLIC_COMMUNITY_ID!,
    };
    
    if (firebaseUser) {
      const token = await firebaseUser.getIdToken();
      headers["Authorization"] = `Bearer ${token}`;
      logger.info("🔍 [fetchCurrentUserClient] Using ID token auth", {
        hasToken: !!token,
      });
    } else {
      logger.info("🔍 [fetchCurrentUserClient] Using session auth");
    }
    
    logger.info("🔍 [fetchCurrentUserClient] Calling apolloClient.query");
    const { data } = await apolloClient.query({
      query: CurrentUserServerDocument,
      fetchPolicy: "network-only",
      context: { headers },
    });
    
    logger.info("🔍 [fetchCurrentUserClient] apolloClient.query completed");
    
    const user = data?.currentUser?.user ?? null;
    logger.info("🔍 [fetchCurrentUserClient] GraphQL response received", {
      hasData: !!data,
      hasCurrentUser: !!data?.currentUser,
      hasUser: !!user,
      userId: user?.id,
      identitiesCount: user?.identities?.length ?? 0,
    });
    
    return user;
  } catch (error) {
    logger.error("🔍 [fetchCurrentUserClient] GraphQL query failed", {
      error: error instanceof Error ? error.message : String(error),
      errorType: error?.constructor?.name,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return null;
  }
}
