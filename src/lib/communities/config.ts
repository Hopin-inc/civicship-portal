import { cache } from "react";
import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { COMMUNITY_LOCAL_CONFIGS } from "@/lib/communities/constants";
import { logger } from "@/lib/logging";

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
    const isBuildPhase = process.env.NEXT_PHASE === "phase-production-build";
    if (isBuildPhase) {
      console.log(`[Build] Skipping API fetch for ${communityId}`);
      return null;
    }
    if (process.env.ENV === "LOCAL" && typeof window === "undefined") {
      console.log(`[LOCAL] Response Local Config for ${communityId}, using static config.`);
      return COMMUNITY_LOCAL_CONFIGS;
    }
    try {
      const data = await executeServerGraphQLQuery<CommunityPortalConfigResponse>(
        COMMUNITY_PORTAL_CONFIG_QUERY,
        { communityId },
      );

      const config = data.communityPortalConfig;

      if (!config) {
        logger.warn("[getCommunityConfig] DB returned null for communityPortalConfig", {
          communityId,
          component: "getCommunityConfig",
        });
      } else {
        const nullFields = (
          ["firebaseTenantId", "liffId", "liffAppId", "liffBaseUrl", "regionName", "regionKey"] as const
        ).filter((field) => config[field] == null);

        logger.info("[getCommunityConfig] Config fetched from DB", {
          communityId,
          configCommunityId: config.communityId,
          firebaseTenantId: config.firebaseTenantId,
          liffId: config.liffId,
          liffAppId: config.liffAppId,
          nullFields: nullFields.length > 0 ? nullFields : undefined,
          component: "getCommunityConfig",
        });
      }

      return config;
    } catch (error) {
      logger.error("[getCommunityConfig] Failed to fetch config from DB", {
        communityId,
        error: error instanceof Error ? error.message : String(error),
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        component: "getCommunityConfig",
      });
      return null;
    }
  },
);

/**
 * Get default OG image for a community config
 */
export function getDefaultOgImage(config: CommunityPortalConfig | null): string[] {
  if (!config) {
    return [];
  }
  return config.ogImagePath ? [config.ogImagePath] : [];
}
