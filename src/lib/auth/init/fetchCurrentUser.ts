import { CurrentUserServerDocument, GqlCurrentUserPayload } from "@/types/graphql";
import { apolloClient } from "@/lib/apollo";
import { logger } from "@/lib/logging";

export async function fetchCurrentUserClient(): Promise<GqlCurrentUserPayload["user"] | null> {
  try {
    logger.info("🔍 [fetchCurrentUserClient] Starting GraphQL query", {
      hasWindow: typeof window !== "undefined",
      apolloClientExists: !!apolloClient,
    });
    
    logger.info("🔍 [fetchCurrentUserClient] Calling apolloClient.query");
    const { data } = await apolloClient.query({
      query: CurrentUserServerDocument,
      fetchPolicy: "network-only",
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
