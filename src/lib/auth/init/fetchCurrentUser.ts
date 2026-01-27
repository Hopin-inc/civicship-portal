import { GqlCurrentUserPayload } from "@/types/graphql";
import { logger } from "@/lib/logging";
import { User } from "firebase/auth";
import { GET_CURRENT_USER_SERVER_QUERY } from "@/graphql/account/user/server";

// Extract communityId from URL path (first segment after /)
function extractCommunityIdFromPath(pathname: string): string | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return null;
  }
  const firstSegment = segments[0];
  // Skip if it's a known non-community path
  if (["api", "_next", "favicon.ico"].includes(firstSegment)) {
    return null;
  }
  return firstSegment;
}

export async function fetchCurrentUserClient(
  firebaseUser?: User | null
): Promise<GqlCurrentUserPayload["user"] | null> {
  try {
    const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
    // Extract communityId from URL path for multi-tenant routing
    const communityId = typeof window !== "undefined" 
      ? extractCommunityIdFromPath(window.location.pathname) 
      : null;

    if (!apiEndpoint) {
      logger.error("[fetchCurrentUserClient] Missing API endpoint");
      return null;
    }

    if (!communityId) {
      logger.warn("[fetchCurrentUserClient] Could not extract communityId from URL path");
      return null;
    }

    const authMode = firebaseUser ? "id_token" : "session";

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      "X-Auth-Mode": authMode,
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
