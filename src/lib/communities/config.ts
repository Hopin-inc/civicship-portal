import { cache } from "react";

/**
 * Community portal configuration fetched from the database
 */
export interface CommunityPortalConfig {
  communityId: string;
  tokenName: string;
  title: string;
  description: string;
  shortDescription: string | null;
  domain: string;
  faviconPrefix: string;
  logoPath: string;
  squareLogoPath: string;
  ogImagePath: string;
  enableFeatures: string[];
  rootPath: string;
  adminRootPath: string;
  documents: CommunityDocumentConfig[] | null;
  commonDocumentOverrides: CommonDocumentOverridesConfig | null;
  regionName: string | null;
  regionKey: string | null;
  liffId: string | null;
  liffBaseUrl: string | null;
  firebaseTenantId: string | null;
}

export interface CommunityDocumentConfig {
  id: string;
  title: string;
  path: string;
  type: string;
  order?: number;
}

export interface CommonDocumentOverridesConfig {
  terms?: CommunityDocumentConfig;
  privacy?: CommunityDocumentConfig;
}

/**
 * Fetch community portal config from the API
 * Uses React cache for request deduplication
 */
export const fetchCommunityPortalConfig = cache(
  async (communityId: string): Promise<CommunityPortalConfig | null> => {
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
        },
        body: JSON.stringify({
          query: `
            query GetCommunityPortalConfig($communityId: String!) {
              communityPortalConfig(communityId: $communityId) {
                communityId
                tokenName
                title
                description
                shortDescription
                domain
                faviconPrefix
                logoPath
                squareLogoPath
                ogImagePath
                enableFeatures
                rootPath
                adminRootPath
                documents {
                  id
                  title
                  path
                  type
                  order
                }
                commonDocumentOverrides {
                  terms {
                    id
                    title
                    path
                    type
                  }
                  privacy {
                    id
                    title
                    path
                    type
                  }
                }
                regionName
                regionKey
                liffId
                liffBaseUrl
                firebaseTenantId
              }
            }
          `,
          variables: { communityId },
        }),
        next: { revalidate: 60 }, // Cache for 60 seconds
      });

      if (!response.ok) {
        console.warn(`Failed to fetch community portal config: ${response.status}`);
        return null;
      }

      const result = await response.json();

      if (result.errors) {
        console.warn("GraphQL errors:", result.errors);
        return null;
      }

      return result.data?.communityPortalConfig ?? null;
    } catch (error) {
      console.warn("Error fetching community portal config:", error);
      return null;
    }
  },
);

/**
 * Get community portal config with fallback to null
 * This is a server-side function that should be called in Server Components or API routes
 */
export async function getCommunityPortalConfig(
  communityId: string,
): Promise<CommunityPortalConfig | null> {
  return fetchCommunityPortalConfig(communityId);
}
