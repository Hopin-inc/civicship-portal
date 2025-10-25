import { GqlCurrentUserPayload } from "@/types/graphql";
import { logger } from "@/lib/logging";
import { User } from "firebase/auth";
import { GET_CURRENT_USER_SERVER_QUERY } from "@/graphql/account/user/server";
import { getAuthForCommunity, getEnvAuthConfig, getEnvCommunityId } from "@/lib/communities/runtime-auth";
import type { CommunityId } from "@/lib/communities/runtime-auth";

export async function fetchCurrentUserClient(
  firebaseUser?: User | null,
  communityId?: string
): Promise<GqlCurrentUserPayload["user"] | null> {
  try {
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
    
    const envCommunityId = getEnvCommunityId();
    const envAuth = getEnvAuthConfig();
    
    const finalCommunityId = envCommunityId ?? communityId ?? "";
    const finalTenantId = finalCommunityId 
      ? getAuthForCommunity(finalCommunityId).tenantId 
      : (envAuth.tenantId ?? "");

    if (!apiEndpoint || !finalTenantId || !finalCommunityId) {
      logger.error("[fetchCurrentUserClient] Missing required configuration", {
        hasApiEndpoint: !!apiEndpoint,
        hasTenantId: !!finalTenantId,
        hasCommunityId: !!finalCommunityId,
      });
      return null;
    }

    const authMode = firebaseUser ? "id_token" : "session";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Auth-Mode": authMode,
      "X-Civicship-Tenant": finalTenantId,
      "X-Community-Id": finalCommunityId,
    };

    if (firebaseUser) {
      const token = await firebaseUser.getIdToken();
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers,
      credentials: "include",
      body: JSON.stringify({
        query: GET_CURRENT_USER_SERVER_QUERY,
        variables: {},
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error("[fetchCurrentUserClient] HTTP error", {
        status: response.status,
        statusText: response.statusText,
        errorText,
      });
      return null;
    }

    const result = await response.json();

    if (result.errors) {
      logger.error("[fetchCurrentUserClient] GraphQL errors", {
        errors: result.errors,
      });
      return null;
    }

    return result.data?.currentUser?.user ?? null;
  } catch (error) {
    logger.error("[fetchCurrentUserClient] Request failed", { error });
    return null;
  }
}
