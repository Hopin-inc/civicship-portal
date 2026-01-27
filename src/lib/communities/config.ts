import { cache } from "react";
import { executeServerGraphQLQuery } from "@/lib/graphql/server";

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
  liffAppId: string | null;
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

const COMMUNITY_PORTAL_CONFIG_QUERY = `
  query CommunityPortalConfig($communityId: String!) {
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
          order
        }
        privacy {
          id
          title
          path
          type
          order
        }
      }
      regionName
      regionKey
      liffId
      liffAppId
      liffBaseUrl
      firebaseTenantId
    }
  }
`;

interface CommunityPortalConfigResponse {
  communityPortalConfig: CommunityPortalConfig | null;
}

/**
 * Get community portal config from the database
 * Uses React cache for request deduplication within a single request
 */
export const getCommunityConfig = cache(
  async (communityId: string): Promise<CommunityPortalConfig | null> => {
    try {
      const data = await executeServerGraphQLQuery<CommunityPortalConfigResponse>(
        COMMUNITY_PORTAL_CONFIG_QUERY,
        { communityId },
        {
          "X-Community-Id": communityId,
        },
      );

      return data.communityPortalConfig;
    } catch (error) {
      console.error(`Failed to fetch community config for ${communityId}:`, error);
      return null;
    }
  },
);

/**
 * Get community portal config or throw an error if not found
 */
export async function getCommunityConfigOrThrow(communityId: string): Promise<CommunityPortalConfig> {
  const config = await getCommunityConfig(communityId);
  if (!config) {
    throw new Error(`Community config not found for ${communityId}`);
  }
  return config;
}

/**
 * Get community config from environment variable
 * Uses NEXT_PUBLIC_COMMUNITY_ID to determine the community
 */
export async function getCommunityConfigFromEnv(): Promise<CommunityPortalConfig | null> {
  const communityId = process.env.NEXT_PUBLIC_COMMUNITY_ID;
  if (!communityId) {
    console.warn("NEXT_PUBLIC_COMMUNITY_ID is not set");
    return null;
  }
  return getCommunityConfig(communityId);
}

/**
 * Get default OG image for a community config
 */
export function getDefaultOgImage(config: CommunityPortalConfig | null): string[] {
  if (!config) {
    return [];
  }
  return config.ogImagePath ? [config.ogImagePath] : [];
}
