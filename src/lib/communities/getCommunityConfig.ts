import { cache } from "react";
import { executeServerGraphQLQuery } from "@/lib/graphql/server";

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
  documents: CommunityDocument[] | null;
  commonDocumentOverrides: CommonDocumentOverrides | null;
  regionName: string | null;
  regionKey: string | null;
  liffId: string | null;
  liffBaseUrl: string | null;
  firebaseTenantId: string | null;
}

export interface CommunityDocument {
  id: string;
  title: string;
  path: string;
  type: string;
  order?: number;
}

export interface CommonDocumentOverrides {
  terms?: CommunityDocument;
  privacy?: CommunityDocument;
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
      liffBaseUrl
      firebaseTenantId
    }
  }
`;

interface CommunityPortalConfigResponse {
  communityPortalConfig: CommunityPortalConfig | null;
}

export const getCommunityConfig = cache(
  async (
    communityId: string,
    headers: Record<string, string> = {},
  ): Promise<CommunityPortalConfig | null> => {
    try {
      const data = await executeServerGraphQLQuery<CommunityPortalConfigResponse>(
        COMMUNITY_PORTAL_CONFIG_QUERY,
        { communityId },
        {
          ...headers,
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

export async function getCommunityConfigOrThrow(
  communityId: string,
  headers: Record<string, string> = {},
): Promise<CommunityPortalConfig> {
  const config = await getCommunityConfig(communityId, headers);
  if (!config) {
    throw new Error(`Community config not found for ${communityId}`);
  }
  return config;
}

// Re-export from edge-safe module for backwards compatibility
export { isValidCommunityId, VALID_COMMUNITY_IDS, type CommunityId } from "./communityIds";
