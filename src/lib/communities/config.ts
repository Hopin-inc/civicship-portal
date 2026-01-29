import { cache } from "react";
import { executeServerGraphQLQuery } from "@/lib/graphql/server";
import { getCommunityIdFromEnv } from "./config-env";
import { COMMUNITY_CONFIGS, CommunityId } from "@/lib/communities/constants";

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

      const dbConfig = data.communityPortalConfig;

      // --- ここからチェック処理を追加 ---
      if (dbConfig) {
        const staticConfig = COMMUNITY_CONFIGS[communityId as CommunityId];
        if (staticConfig) {
          checkConfigMismatch(communityId, staticConfig, dbConfig);
        } else {
          console.warn(`[Config Check] ⚠️ No static config found for ID: ${communityId}`);
        }
      }
      // --- ここまで ---

      return dbConfig;
    } catch (error) {
      console.error(`Failed to fetch community config for ${communityId}:`, error);
      return null;
    }
  },
);

function checkConfigMismatch(
  communityId: string,
  staticConfig: any,
  dbConfig: CommunityPortalConfig,
) {
  const comparisons = [
    {
      label: "LIFF Short ID (LINE_CLIENT_ID)",
      staticVal: staticConfig.LINE_CLIENT_ID,
      dbVal: dbConfig.liffId,
    },
    {
      label: "LIFF Full ID (LIFF_ID)",
      staticVal: staticConfig.LIFF_ID,
      dbVal: dbConfig.liffAppId,
    },
    {
      label: "Firebase Tenant ID",
      staticVal: staticConfig.FIREBASE_AUTH_TENANT_ID,
      dbVal: dbConfig.firebaseTenantId,
    },
  ];

  let hasMismatch = false;

  comparisons.forEach(({ label, staticVal, dbVal }) => {
    // 両方に値がある場合のみ比較（片方が未設定ならスキップして事故を防ぐ）
    if (staticVal && dbVal && staticVal !== dbVal) {
      hasMismatch = true;
      console.warn(
        `[⚠️ CONFIG MISMATCH] ${communityId}: ${label} is different!\n` +
          `   - Static (Constants): "${staticVal}"\n` +
          `   - DB (Supabase):      "${dbVal}"`,
      );
    }
  });

  if (!hasMismatch) {
    console.log(`[Config Check] ✅ ${communityId}: IDs match between Static and DB.`);
  }
}

/**
 * Get community ID from environment variable
 * Re-exported from config-env.ts for convenience
 */
export { getCommunityIdFromEnv } from "./config-env";

/**
 * Get default OG image for a community config
 */
export function getDefaultOgImage(config: CommunityPortalConfig | null): string[] {
  if (!config) {
    return [];
  }
  return config.ogImagePath ? [config.ogImagePath] : [];
}

/**
 * Get community config using the environment variable community ID
 * Convenience function for server components
 */
export async function getCommunityConfigFromEnv(): Promise<CommunityPortalConfig | null> {
  const communityId = getCommunityIdFromEnv();
  return getCommunityConfig(communityId);
}
