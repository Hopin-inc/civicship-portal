/**
 * Edge Runtime compatible community configuration utilities
 * These functions can be used in middleware and edge runtime
 * because they use fetch directly without React cache or server-side imports
 */

/**
 * Get community ID from environment variable
 * @deprecated Use URL path-based routing instead. In multi-tenant architecture,
 * communityId should be extracted from the URL path (e.g., /neo88/opportunities -> "neo88")
 * For client-side: use useParams() or extract from window.location.pathname
 * For server-side: pass communityId as a parameter from route params
 */
export function getCommunityIdFromEnv(): string {
  const communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID;
  if (!communityId) {
    console.warn("NEXT_PUBLIC_COMMUNITY_ID is not set, using 'default'. Consider using URL path-based routing instead.");
    return "default";
  }
  return communityId;
}

/**
 * Minimal config type for middleware/edge runtime use
 */
export interface EdgeCommunityConfig {
  enableFeatures: string[];
  rootPath: string;
}

/**
 * GraphQL query for fetching minimal config needed in middleware
 */
const MINIMAL_CONFIG_QUERY = `
  query CommunityPortalConfig($communityId: String!) {
    communityPortalConfig(communityId: $communityId) {
      enableFeatures
      rootPath
    }
  }
`;

/**
 * In-memory cache for community config to avoid repeated API calls
 * This is a simple cache that persists for the lifetime of the edge function
 */
let configCache: EdgeCommunityConfig | null = null;
let configCacheTimestamp: number = 0;
const CACHE_TTL_MS = 60000; // 1 minute cache

/**
 * Fetch community config from the server-side API
 * This function is Edge Runtime compatible and uses fetch directly
 */
export async function fetchCommunityConfigForEdge(communityId: string): Promise<EdgeCommunityConfig | null> {
  // Check cache first
  const now = Date.now();
  if (configCache && (now - configCacheTimestamp) < CACHE_TTL_MS) {
    return configCache;
  }

  const apiEndpoint = process.env.NEXT_PUBLIC_API_ENDPOINT;
  if (!apiEndpoint) {
    console.warn("NEXT_PUBLIC_API_ENDPOINT is not set");
    return null;
  }

  try {
    const response = await fetch(`${apiEndpoint}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Community-Id": communityId,
      },
      body: JSON.stringify({
        query: MINIMAL_CONFIG_QUERY,
        variables: { communityId },
      }),
    });

    if (!response.ok) {
      console.error(`Failed to fetch community config: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const config = data?.data?.communityPortalConfig;

    if (config) {
      // Update cache
      configCache = {
        enableFeatures: config.enableFeatures || [],
        rootPath: config.rootPath || "/",
      };
      configCacheTimestamp = now;
      return configCache;
    }

    return null;
  } catch (error) {
    console.error("Failed to fetch community config:", error);
    return null;
  }
}

/**
 * Get enabled features from server-side config
 * Falls back to empty array if fetch fails
 */
export async function getEnabledFeatures(communityId: string): Promise<string[]> {
  const config = await fetchCommunityConfigForEdge(communityId);
  return config?.enableFeatures || [];
}

/**
 * Get root path from server-side config
 * Falls back to "/" if fetch fails
 */
export async function getRootPath(communityId: string): Promise<string> {
  const config = await fetchCommunityConfigForEdge(communityId);
  return config?.rootPath || "/";
}
