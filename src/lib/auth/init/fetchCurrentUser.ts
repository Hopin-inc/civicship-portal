import { GqlCurrentUserPayload } from "@/types/graphql";
import { logger } from "@/lib/logging";
import { User } from "firebase/auth";
import { GET_CURRENT_USER_SERVER_QUERY } from "@/graphql/account/user/server";
import { CommunityPortalConfig } from "@/lib/communities/config";

export async function fetchCurrentUserClient(
  communityConfig: CommunityPortalConfig | null,
  firebaseUser?: User | null,
): Promise<GqlCurrentUserPayload["user"] | null> {
  try {
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
    const tenantId = communityConfig?.firebaseTenantId;
    const communityId = communityConfig?.communityId;

    if (!apiEndpoint || !tenantId || !communityId) {
      logger.error("[fetchCurrentUserClient] Missing required environment variables", {
        hasApiEndpoint: !!apiEndpoint,
        hasTenantId: !!tenantId,
        hasCommunityId: !!communityId,
      });
      return null;
    }

    const authMode = firebaseUser ? "id_token" : "session";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Auth-Mode": authMode,
      "X-Civicship-Tenant": tenantId,
      "X-Community-Id": communityId,
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
      logger.warn("[fetchCurrentUserClient] HTTP error", {
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
    logger.warn("[fetchCurrentUserClient] Request failed", { error });
    return null;
  }
}
